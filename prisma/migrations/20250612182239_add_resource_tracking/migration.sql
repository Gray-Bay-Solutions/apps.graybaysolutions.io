-- AlterTable
ALTER TABLE `Client` ADD COLUMN `contractEndDate` DATETIME(3) NULL,
    ADD COLUMN `contractStartDate` DATETIME(3) NULL,
    ADD COLUMN `monthlyBudget` DOUBLE NULL,
    ADD COLUMN `tier` VARCHAR(191) NOT NULL DEFAULT 'standard';

-- AlterTable
ALTER TABLE `Metric` ADD COLUMN `cost` DOUBLE NULL,
    ADD COLUMN `threshold` DOUBLE NULL,
    ADD COLUMN `unit` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Service` ADD COLUMN `capacityLimit` INTEGER NULL,
    ADD COLUMN `costPerUnit` DOUBLE NULL,
    ADD COLUMN `currentUsage` DOUBLE NULL,
    ADD COLUMN `scalingThreshold` DOUBLE NULL;

-- CreateTable
CREATE TABLE `ResourceAllocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clientId` INTEGER NOT NULL,
    `serviceId` INTEGER NOT NULL,
    `allocated` DOUBLE NOT NULL,
    `used` DOUBLE NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cost` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clientId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PotentialClient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `website` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'lead',
    `interestedServices` TEXT NOT NULL,
    `estimatedBudget` DOUBLE NULL,
    `firstContact` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastContact` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` TEXT NULL,
    `assignedTo` VARCHAR(191) NULL,
    `probability` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ResourceAllocation` ADD CONSTRAINT `ResourceAllocation_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResourceAllocation` ADD CONSTRAINT `ResourceAllocation_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
