import { IconListDetails, IconPackage, IconPackageOff, IconPackages, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

// import { getTotalProducts } from '../app/api/routes'
// import { ProductCountCard, StockCountCard } from "./count";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react";
import { fetchItems } from "@/api/item.api";
import { fetchInventory } from "@/api/inventory.api";

// import { useEffect, useState } from "react";


export function SectionCards() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [totalOutStock, setTotalOutStock] = useState(0);

  useEffect(() => {
    async function fetchTotalProducts() {
      try {
        const products = await fetchItems(); // ambil data dari fungsi async
        setTotalProducts(products.length); // contoh: menampilkan jumlah produk
        const stock = await fetchInventory();
        const total = stock.reduce((sum: number, item: any) => sum + item.qty_available, 0);
        const totalOutStock = stock.filter((item: any) => item.qty_available === 0).length;
        setTotalStock(total);
        setTotalOutStock(totalOutStock);
      } catch (error) {
        console.error("Error fetching total products:", error);
      }
    }

    fetchTotalProducts();
  }, []);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardAction>
            <IconPackage />
          </CardAction>
          <CardDescription>Total Product</CardDescription>
          {/* <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"> */}
            {/* <ProductCountCard /> */}
          {/* </CardTitle> */}
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalProducts}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Total stock keeping unit shows the numbers of unique product types in the warehouse
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardAction>
            <IconListDetails />
          </CardAction>
          <CardDescription>Purchase Order</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          0
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 0% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardAction>
            <IconPackages />
          </CardAction>
          <CardDescription>Total Stock</CardDescription>
          {/* <StockCountCard /> */}
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalStock}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Total Stock shows the total quantity of all items
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardAction>
            <IconPackageOff />
          </CardAction>
          <CardDescription>Out Of Stock</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalOutStock}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Out of stock show the number of products with zer available quantity
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}