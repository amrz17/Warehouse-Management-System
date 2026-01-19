import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRelationOnPurchaseOrders1768814159588 implements MigrationInterface {
    name = 'FixRelationOnPurchaseOrders1768814159588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase_order_items" DROP CONSTRAINT "FK_e757fdc72cc8f3066c1dc39c765"`);
        await queryRunner.query(`ALTER TABLE "purchase_order_items" RENAME COLUMN "itemIdItem" TO "id_item"`);
        await queryRunner.query(`ALTER TABLE "inbounds" DROP COLUMN "supplier_name"`);
        await queryRunner.query(`ALTER TABLE "inbounds" DROP COLUMN "purchase_order"`);
        await queryRunner.query(`ALTER TABLE "inbounds" DROP COLUMN "received_by"`);
        await queryRunner.query(`ALTER TABLE "purchase_order_items" ALTER COLUMN "id_item" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inbounds" DROP CONSTRAINT "FK_66b9ae2a4753bce84c786929f6f"`);
        await queryRunner.query(`ALTER TABLE "inbounds" DROP CONSTRAINT "FK_2abb154c5ec54ec57b93da0b91b"`);
        await queryRunner.query(`ALTER TABLE "inbounds" DROP CONSTRAINT "FK_c88d5fcc81b951ca416c97dd227"`);
        await queryRunner.query(`ALTER TABLE "inbounds" ALTER COLUMN "id_po" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inbounds" ALTER COLUMN "id_user" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inbounds" ALTER COLUMN "id_supplier" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchase_order_items" ADD CONSTRAINT "FK_7b3e345a0bdbabbbc8346d494ae" FOREIGN KEY ("id_item") REFERENCES "items"("id_item") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inbounds" ADD CONSTRAINT "FK_66b9ae2a4753bce84c786929f6f" FOREIGN KEY ("id_po") REFERENCES "purchase_orders"("id_po") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inbounds" ADD CONSTRAINT "FK_2abb154c5ec54ec57b93da0b91b" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inbounds" ADD CONSTRAINT "FK_c88d5fcc81b951ca416c97dd227" FOREIGN KEY ("id_supplier") REFERENCES "suppliers"("id_supplier") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inbounds" DROP CONSTRAINT "FK_c88d5fcc81b951ca416c97dd227"`);
        await queryRunner.query(`ALTER TABLE "inbounds" DROP CONSTRAINT "FK_2abb154c5ec54ec57b93da0b91b"`);
        await queryRunner.query(`ALTER TABLE "inbounds" DROP CONSTRAINT "FK_66b9ae2a4753bce84c786929f6f"`);
        await queryRunner.query(`ALTER TABLE "purchase_order_items" DROP CONSTRAINT "FK_7b3e345a0bdbabbbc8346d494ae"`);
        await queryRunner.query(`ALTER TABLE "inbounds" ALTER COLUMN "id_supplier" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inbounds" ALTER COLUMN "id_user" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inbounds" ALTER COLUMN "id_po" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inbounds" ADD CONSTRAINT "FK_c88d5fcc81b951ca416c97dd227" FOREIGN KEY ("id_supplier") REFERENCES "suppliers"("id_supplier") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inbounds" ADD CONSTRAINT "FK_2abb154c5ec54ec57b93da0b91b" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inbounds" ADD CONSTRAINT "FK_66b9ae2a4753bce84c786929f6f" FOREIGN KEY ("id_po") REFERENCES "purchase_orders"("id_po") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_order_items" ALTER COLUMN "id_item" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inbounds" ADD "received_by" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inbounds" ADD "purchase_order" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inbounds" ADD "supplier_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchase_order_items" RENAME COLUMN "id_item" TO "itemIdItem"`);
        await queryRunner.query(`ALTER TABLE "purchase_order_items" ADD CONSTRAINT "FK_e757fdc72cc8f3066c1dc39c765" FOREIGN KEY ("itemIdItem") REFERENCES "items"("id_item") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
