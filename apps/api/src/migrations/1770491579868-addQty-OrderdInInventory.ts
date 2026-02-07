import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQtyOrderdInInventory1770491579868 implements MigrationInterface {
    name = 'AddQtyOrderdInInventory1770491579868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "suppliers" ("id_supplier" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "suppliers_address" text NOT NULL, "pic_name" character varying NOT NULL, CONSTRAINT "UQ_5b5720d9645cee7396595a16c93" UNIQUE ("name"), CONSTRAINT "PK_f2dc88217f64de773c2b5680f7a" PRIMARY KEY ("id_supplier"))`);
        await queryRunner.query(`CREATE TABLE "locations" ("id_location" uuid NOT NULL DEFAULT uuid_generate_v4(), "bin_code" character varying NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ae0f70d0e42f6e577a17d048510" UNIQUE ("bin_code"), CONSTRAINT "PK_2e73b1fc5b967273d2c7dd853b7" PRIMARY KEY ("id_location"))`);
        await queryRunner.query(`CREATE TABLE "inventory" ("id_inventory" uuid NOT NULL DEFAULT uuid_generate_v4(), "id_item" uuid NOT NULL, "id_location" uuid NOT NULL, "qty_available" integer NOT NULL DEFAULT '0', "qty_reserved" integer NOT NULL DEFAULT '0', "qty_ordered" integer NOT NULL DEFAULT '0', "last_updated" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_954acca8e3bbb4d268b98e6ed12" UNIQUE ("id_item", "id_location"), CONSTRAINT "PK_2cdc32684ad0baa9e8d3971b8fe" PRIMARY KEY ("id_inventory"))`);
        await queryRunner.query(`CREATE TABLE "customers" ("id_customer" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_name" character varying NOT NULL, "customer_address" text, "customer_phone" character varying NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a1dded0c9e77a3e62a09d20ed88" UNIQUE ("customer_name"), CONSTRAINT "PK_5bb1d14d487c9a2f298ed76a3f9" PRIMARY KEY ("id_customer"))`);
        await queryRunner.query(`CREATE TYPE "public"."outbound_status_outbound_enum" AS ENUM('OPEN', 'PICKING', 'PACKING', 'SHIPPED', 'COMPLETED', 'CANCELED')`);
        await queryRunner.query(`CREATE TABLE "outbound" ("id_outbound" uuid NOT NULL DEFAULT uuid_generate_v4(), "outbound_number" character varying NOT NULL, "id_so" uuid NOT NULL, "id_user" uuid NOT NULL, "id_customer" uuid NOT NULL, "shipped_at" TIMESTAMP NOT NULL, "carrier_name" character varying NOT NULL, "tracking_number" character varying NOT NULL, "status_outbound" "public"."outbound_status_outbound_enum" NOT NULL DEFAULT 'OPEN', "note" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_33be109921055f53d126502493c" UNIQUE ("outbound_number"), CONSTRAINT "PK_6de34e699fe8365906a46c5600e" PRIMARY KEY ("id_outbound"))`);
        await queryRunner.query(`CREATE TYPE "public"."sales_orders_so_status_enum" AS ENUM('PENDING', 'APPROVED', 'PICKING', 'SHIPPED', 'CANCELED', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "sales_orders" ("id_so" uuid NOT NULL DEFAULT uuid_generate_v4(), "so_number" character varying NOT NULL, "so_status" "public"."sales_orders_so_status_enum" NOT NULL DEFAULT 'PENDING', "date_shipped" TIMESTAMP NOT NULL, "id_customer" uuid NOT NULL, "note" character varying NOT NULL, "id_user" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_11d4347629a3126af8cca9787d3" UNIQUE ("so_number"), CONSTRAINT "PK_20959038dd0b4ae7395baa11b76" PRIMARY KEY ("id_so"))`);
        await queryRunner.query(`CREATE TABLE "sale_order_items" ("id_soi" uuid NOT NULL DEFAULT uuid_generate_v4(), "id_so" uuid NOT NULL, "id_item" uuid NOT NULL, "qty_ordered" integer NOT NULL, "qty_shipped" integer NOT NULL, "price_per_unit" numeric(10,2) NOT NULL, "total_price" numeric(10,2) NOT NULL, "last_updated" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e79cc732b4b7a0071c1b3a8e91a" PRIMARY KEY ("id_soi"))`);
        await queryRunner.query(`CREATE TABLE "outbound_items" ("id_outbound_item" uuid NOT NULL DEFAULT uuid_generate_v4(), "id_outbound" uuid NOT NULL, "id_soi" uuid NOT NULL, "id_item" uuid NOT NULL, "qty_shipped" integer NOT NULL, "last_update" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8ae48b13af1edc4c1c50109cd75" PRIMARY KEY ("id_outbound_item"))`);
        await queryRunner.query(`CREATE TABLE "items" ("id_item" uuid NOT NULL DEFAULT uuid_generate_v4(), "sku" character varying NOT NULL, "name" character varying NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ed4485e4da7cc242cf46db2e3a9" UNIQUE ("sku"), CONSTRAINT "PK_f425d2daf1cac427d052cd00a03" PRIMARY KEY ("id_item"))`);
        await queryRunner.query(`CREATE TABLE "inbound_items" ("id_inbound_item" uuid NOT NULL DEFAULT uuid_generate_v4(), "id_inbound" uuid NOT NULL, "id_item" uuid NOT NULL, "id_poi" uuid NOT NULL, "qty_received" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fa48753237d04b2b178d75c5d92" PRIMARY KEY ("id_inbound_item"))`);
        await queryRunner.query(`CREATE TABLE "purchase_order_items" ("id_poi" uuid NOT NULL DEFAULT uuid_generate_v4(), "id_po" uuid NOT NULL, "id_item" uuid NOT NULL, "qty_ordered" integer NOT NULL, "price_per_unit" numeric(10,2) NOT NULL, "qty_received" integer NOT NULL DEFAULT '0', "total_price" numeric(10,2) NOT NULL, CONSTRAINT "PK_5cdc9cea738fb7317a8056ed1ce" PRIMARY KEY ("id_poi"))`);
        await queryRunner.query(`CREATE TYPE "public"."purchase_orders_po_status_enum" AS ENUM('PENDING', 'APPROVED', 'SHIPPED', 'RECEIVED', 'CANCELED', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "purchase_orders" ("id_po" uuid NOT NULL DEFAULT uuid_generate_v4(), "id_user" uuid NOT NULL, "po_number" character varying NOT NULL, "id_supplier" uuid NOT NULL, "expected_delivery_date" date, "po_status" "public"."purchase_orders_po_status_enum" NOT NULL DEFAULT 'PENDING', "note" character varying NOT NULL, "last_updated" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_74065a5d2b8c4c14b8b8fcf0159" UNIQUE ("po_number"), CONSTRAINT "PK_66ea391e379c6cf276f73f9512a" PRIMARY KEY ("id_po"))`);
        await queryRunner.query(`CREATE TYPE "public"."inbounds_status_inbound_enum" AS ENUM('CANCELED', 'DRAFT', 'PARTIAL', 'RECEIVED')`);
        await queryRunner.query(`CREATE TABLE "inbounds" ("id_inbound" uuid NOT NULL DEFAULT uuid_generate_v4(), "inbound_number" character varying NOT NULL, "id_po" uuid NOT NULL, "id_user" uuid NOT NULL, "received_at" TIMESTAMP NOT NULL, "id_supplier" uuid NOT NULL, "note" character varying, "status_inbound" "public"."inbounds_status_inbound_enum" NOT NULL DEFAULT 'RECEIVED', "last_update" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9a168f99a44e4e697660d45fd72" UNIQUE ("inbound_number"), CONSTRAINT "PK_10acab85128256e0e493cfc61ed" PRIMARY KEY ("id_inbound"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'MANAGER', 'STAFF_GUDANG', 'PICKER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id_user" uuid NOT NULL DEFAULT uuid_generate_v4(), "full_name" character varying(255) NOT NULL, "username" character varying(50) NOT NULL, "email" character varying, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'STAFF_GUDANG', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_fbb07fa6fbd1d74bee9782fb945" PRIMARY KEY ("id_user"))`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD CONSTRAINT "FK_c8c4617b0e2d3ed23f646a44dbb" FOREIGN KEY ("id_item") REFERENCES "items"("id_item") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD CONSTRAINT "FK_2ff5ba049682716af334bce51ee" FOREIGN KEY ("id_location") REFERENCES "locations"("id_location") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "outbound" ADD CONSTRAINT "FK_f62897bfd63fb65538b702cc207" FOREIGN KEY ("id_so") REFERENCES "sales_orders"("id_so") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "outbound" ADD CONSTRAINT "FK_2184a332c44ca6e0793ed83fcaa" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "outbound" ADD CONSTRAINT "FK_963b5967b3b817a10c7a86a7855" FOREIGN KEY ("id_customer") REFERENCES "customers"("id_customer") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales_orders" ADD CONSTRAINT "FK_98a47b1a71a9324b8d2b43ec54a" FOREIGN KEY ("id_customer") REFERENCES "customers"("id_customer") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales_orders" ADD CONSTRAINT "FK_fe2af6bf45f2d9e4e1e387a3171" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_order_items" ADD CONSTRAINT "FK_893babfadf11841c7a490c68367" FOREIGN KEY ("id_so") REFERENCES "sales_orders"("id_so") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_order_items" ADD CONSTRAINT "FK_113eb7211d95b2adaadd5872164" FOREIGN KEY ("id_item") REFERENCES "items"("id_item") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "outbound_items" ADD CONSTRAINT "FK_60f0cff13a6b1136b51e56e5eee" FOREIGN KEY ("id_outbound") REFERENCES "outbound"("id_outbound") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "outbound_items" ADD CONSTRAINT "FK_1182291b6fd0f93f9b1d0ded4c5" FOREIGN KEY ("id_soi") REFERENCES "sale_order_items"("id_soi") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "outbound_items" ADD CONSTRAINT "FK_daa67832680b1836088541a7de2" FOREIGN KEY ("id_item") REFERENCES "items"("id_item") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inbound_items" ADD CONSTRAINT "FK_28257cacfb0ebd38bf62db248e6" FOREIGN KEY ("id_inbound") REFERENCES "inbounds"("id_inbound") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inbound_items" ADD CONSTRAINT "FK_feb6cc20da27b427d13ea04cc4a" FOREIGN KEY ("id_item") REFERENCES "items"("id_item") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inbound_items" ADD CONSTRAINT "FK_45dcb8c6eff67918326c4f66f63" FOREIGN KEY ("id_poi") REFERENCES "purchase_order_items"("id_poi") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_order_items" ADD CONSTRAINT "FK_23285b58df5491131645804d429" FOREIGN KEY ("id_po") REFERENCES "purchase_orders"("id_po") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_order_items" ADD CONSTRAINT "FK_7b3e345a0bdbabbbc8346d494ae" FOREIGN KEY ("id_item") REFERENCES "items"("id_item") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_orders" ADD CONSTRAINT "FK_e75fa6e03f388996ebfd3612051" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_orders" ADD CONSTRAINT "FK_cb6ae7d21ca1c7c00f50393e027" FOREIGN KEY ("id_supplier") REFERENCES "suppliers"("id_supplier") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inbounds" ADD CONSTRAINT "FK_66b9ae2a4753bce84c786929f6f" FOREIGN KEY ("id_po") REFERENCES "purchase_orders"("id_po") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inbounds" ADD CONSTRAINT "FK_2abb154c5ec54ec57b93da0b91b" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inbounds" ADD CONSTRAINT "FK_c88d5fcc81b951ca416c97dd227" FOREIGN KEY ("id_supplier") REFERENCES "suppliers"("id_supplier") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inbounds" DROP CONSTRAINT "FK_c88d5fcc81b951ca416c97dd227"`);
        await queryRunner.query(`ALTER TABLE "inbounds" DROP CONSTRAINT "FK_2abb154c5ec54ec57b93da0b91b"`);
        await queryRunner.query(`ALTER TABLE "inbounds" DROP CONSTRAINT "FK_66b9ae2a4753bce84c786929f6f"`);
        await queryRunner.query(`ALTER TABLE "purchase_orders" DROP CONSTRAINT "FK_cb6ae7d21ca1c7c00f50393e027"`);
        await queryRunner.query(`ALTER TABLE "purchase_orders" DROP CONSTRAINT "FK_e75fa6e03f388996ebfd3612051"`);
        await queryRunner.query(`ALTER TABLE "purchase_order_items" DROP CONSTRAINT "FK_7b3e345a0bdbabbbc8346d494ae"`);
        await queryRunner.query(`ALTER TABLE "purchase_order_items" DROP CONSTRAINT "FK_23285b58df5491131645804d429"`);
        await queryRunner.query(`ALTER TABLE "inbound_items" DROP CONSTRAINT "FK_45dcb8c6eff67918326c4f66f63"`);
        await queryRunner.query(`ALTER TABLE "inbound_items" DROP CONSTRAINT "FK_feb6cc20da27b427d13ea04cc4a"`);
        await queryRunner.query(`ALTER TABLE "inbound_items" DROP CONSTRAINT "FK_28257cacfb0ebd38bf62db248e6"`);
        await queryRunner.query(`ALTER TABLE "outbound_items" DROP CONSTRAINT "FK_daa67832680b1836088541a7de2"`);
        await queryRunner.query(`ALTER TABLE "outbound_items" DROP CONSTRAINT "FK_1182291b6fd0f93f9b1d0ded4c5"`);
        await queryRunner.query(`ALTER TABLE "outbound_items" DROP CONSTRAINT "FK_60f0cff13a6b1136b51e56e5eee"`);
        await queryRunner.query(`ALTER TABLE "sale_order_items" DROP CONSTRAINT "FK_113eb7211d95b2adaadd5872164"`);
        await queryRunner.query(`ALTER TABLE "sale_order_items" DROP CONSTRAINT "FK_893babfadf11841c7a490c68367"`);
        await queryRunner.query(`ALTER TABLE "sales_orders" DROP CONSTRAINT "FK_fe2af6bf45f2d9e4e1e387a3171"`);
        await queryRunner.query(`ALTER TABLE "sales_orders" DROP CONSTRAINT "FK_98a47b1a71a9324b8d2b43ec54a"`);
        await queryRunner.query(`ALTER TABLE "outbound" DROP CONSTRAINT "FK_963b5967b3b817a10c7a86a7855"`);
        await queryRunner.query(`ALTER TABLE "outbound" DROP CONSTRAINT "FK_2184a332c44ca6e0793ed83fcaa"`);
        await queryRunner.query(`ALTER TABLE "outbound" DROP CONSTRAINT "FK_f62897bfd63fb65538b702cc207"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP CONSTRAINT "FK_2ff5ba049682716af334bce51ee"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP CONSTRAINT "FK_c8c4617b0e2d3ed23f646a44dbb"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "inbounds"`);
        await queryRunner.query(`DROP TYPE "public"."inbounds_status_inbound_enum"`);
        await queryRunner.query(`DROP TABLE "purchase_orders"`);
        await queryRunner.query(`DROP TYPE "public"."purchase_orders_po_status_enum"`);
        await queryRunner.query(`DROP TABLE "purchase_order_items"`);
        await queryRunner.query(`DROP TABLE "inbound_items"`);
        await queryRunner.query(`DROP TABLE "items"`);
        await queryRunner.query(`DROP TABLE "outbound_items"`);
        await queryRunner.query(`DROP TABLE "sale_order_items"`);
        await queryRunner.query(`DROP TABLE "sales_orders"`);
        await queryRunner.query(`DROP TYPE "public"."sales_orders_so_status_enum"`);
        await queryRunner.query(`DROP TABLE "outbound"`);
        await queryRunner.query(`DROP TYPE "public"."outbound_status_outbound_enum"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
        await queryRunner.query(`DROP TABLE "locations"`);
        await queryRunner.query(`DROP TABLE "suppliers"`);
    }

}
