import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Products.models";
import SellerProfile from "@/models/SellerProfiles.models";

const DEMAND_SERVER_URL = process.env.DEMAND_SERVER_URL || "http://localhost:8004";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "seller" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    await dbConnect();
    
    // Get seller profile for authorization
    let sellerProfile: any = null;
    if (session.user.role === "seller") {
      sellerProfile = await SellerProfile.findOne({ userId: session.user.id });
      if (!sellerProfile) {
        return NextResponse.json({ error: "Seller profile not found" }, { status: 404 });
      }
    }

    if (action === "forecast") {
      const productId = searchParams.get("productId");
      const days = searchParams.get("days") || "7";

      if (!productId) {
        return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
      }

      // Verify the seller owns this product
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      if (session.user.role !== "admin" && sellerProfile) {
        if (product.sellerId.toString() !== sellerProfile._id.toString()) {
          return NextResponse.json({ error: "Unauthorized to view this product" }, { status: 403 });
        }
      }

      try {
        const response = await fetch(`${DEMAND_SERVER_URL}/api/forecast/${productId}?days=${days}`);
        if (!response.ok) {
          return NextResponse.json({ error: "Failed to fetch from demand server" }, { status: response.status });
        }
        const data = await response.json();
        return NextResponse.json(data);
      } catch {
        return NextResponse.json({ error: "Demand server is unreachable" }, { status: 503 });
      }
    }

    else if (action === "alerts") {
      const days = searchParams.get("days") || "7";
      try {
        if (session.user.role === "seller" && sellerProfile) {
          const response = await fetch(`${DEMAND_SERVER_URL}/api/stock-alerts?days=${days}&seller_id=${sellerProfile._id.toString()}`);
          if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch from demand server" }, { status: response.status });
          }
          const data = await response.json();
          return NextResponse.json(data);
        } else {
          const response = await fetch(`${DEMAND_SERVER_URL}/api/stock-alerts?days=${days}`);
          if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch from demand server" }, { status: response.status });
          }
          const data = await response.json();
          return NextResponse.json(data);
        }
      } catch {
        return NextResponse.json({ error: "Demand server is unreachable" }, { status: 503 });
      }
    }

    // Action: all-forecasts - get forecasts for multiple seller products
    else if (action === "all-forecasts") {
      const days = searchParams.get("days") || "14";
      // Cap at 20 to ensure it finishes within timeout, while still showing "all" major products
      const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 20);

      try {
        const sellerProducts = await Product.find({ sellerId: sellerProfile?._id })
          .sort({ orderCount: -1 })
          .limit(limit)
          .select("_id name stock price orderCount")
          .lean();

        // Fetch all product forecasts in parallel instead of sequentially
        const forecastPromises = sellerProducts.map(async (product) => {
          try {
            const response = await fetch(`${DEMAND_SERVER_URL}/api/forecast/${product._id}?days=${days}`);
            if (response.ok) {
              const data = await response.json();
              return {
                product_id: product._id.toString(),
                name: (product as any).name,
                current_stock: (product as any).stock || 0,
                price: (product as any).price || 0,
                history: data.history || [],
                forecasts: data.forecasts || [],
                total_predicted_demand: data.total_predicted_demand || 0,
              };
            }
          } catch {
            return null;
          }
          return null;
        });

        const results = await Promise.all(forecastPromises);
        const forecasts = results.filter((f) => f !== null);

        return NextResponse.json({ success: true, data: forecasts });
      } catch {
        return NextResponse.json({ error: "Demand server is unreachable" }, { status: 503 });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Demand API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
