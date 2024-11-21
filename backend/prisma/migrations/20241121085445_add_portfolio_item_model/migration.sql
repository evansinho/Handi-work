-- CreateTable
CREATE TABLE "portfolio_items" (
    "id" UUID NOT NULL,
    "artisanId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portfolio_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_artisanId_fkey" FOREIGN KEY ("artisanId") REFERENCES "artisan_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
