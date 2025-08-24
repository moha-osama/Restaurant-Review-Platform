-- CreateTable
CREATE TABLE "public"."Events" (
    "id" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_properties" JSONB NOT NULL,
    "experiment_id" TEXT,
    "variant_id" TEXT,
    "device_type" TEXT NOT NULL,
    "platform" TEXT NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Assignment" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "experiment_id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Variant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "experiment_id" TEXT NOT NULL,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Experiment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),

    CONSTRAINT "Experiment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Events" ADD CONSTRAINT "Events_experiment_id_fkey" FOREIGN KEY ("experiment_id") REFERENCES "public"."Experiment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Events" ADD CONSTRAINT "Events_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."Variant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_experiment_id_fkey" FOREIGN KEY ("experiment_id") REFERENCES "public"."Experiment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Variant" ADD CONSTRAINT "Variant_experiment_id_fkey" FOREIGN KEY ("experiment_id") REFERENCES "public"."Experiment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
