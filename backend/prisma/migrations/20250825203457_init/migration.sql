-- CreateTable
CREATE TABLE "public"."ReviewVote" (
    "id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReviewVote_review_id_user_id_key" ON "public"."ReviewVote"("review_id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."ReviewVote" ADD CONSTRAINT "ReviewVote_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReviewVote" ADD CONSTRAINT "ReviewVote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
