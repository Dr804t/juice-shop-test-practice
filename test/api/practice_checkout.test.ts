/*
 * Practice Lab: API Automation (Middle Level)
 * Objective: Orchestrate a full checkout flow.
 */

import request from "supertest";
import { expect } from "chai";
import type { Express } from "express";
import { createTestApp } from "./helpers/setup";

let app: Express;

describe("Checkout Flow Practice", () => {
  let token: string;
  let basketId: number;

  before(async () => {
    const result = await createTestApp();
    app = result.app;

    // Step 1: Login
    const response = await request(app).post("/rest/user/login").send({
      email: "admin@juice-sh.op",
      password: "admin123",
    });
    token = response.body.authentication.token;
    basketId = response.body.authentication.bid;
  });

  it("should complete a full checkout journey", async () => {
    // 1. Add an item to the basket (You know this!)
    const addRes = await request(app)
      .post("/api/BasketItems")
      .set("Authorization", `Bearer ${token}`)
      .send({ ProductId: 1, BasketId: basketId, quantity: 1 });

    expect(addRes.status).to.equal(200)

    // 2. GET an Address ID
    // Hint: Use GET /api/Addresss. The admin user has pre-saved addresses.
    const addressRes = await request(app)
      .get("/api/Addresss")
      .set("Authorization", `Bearer ${token}`);
    const addressId = addressRes.body.data[0].id;

    // 3. GET a Delivery Method ID
    // Hint: Use GET /api/Deliverys
    const deliveryRes = await request(app)
      .get("/api/Deliverys")
      .set("Authorization", `Bearer ${token}`);
    const deliveryMethodId = deliveryRes.body.data[0].id;

    // 4. GET a Payment Method ID
    // Hint: Use GET /api/Cards
    const cardRes = await request(app)
      .get("/api/Cards")
      .set("Authorization", `Bearer ${token}`);
    const paymentId = cardRes.body.data[0].id;

    // 5. THE FINAL BOSS: Checkout
    // Endpoint: POST /rest/basket/${basketId}/checkout
    // Payload shape (I found this in the source code for you!):
    /*
      {
        "orderDetails": {
          "addressId": X,
          "deliveryMethodId": Y,
          "paymentId": Z
        }
      }
    */

    // TODO: Write the POST request here!
    // const checkoutResponse = await request(app).post(...).send(...)
    const checkoutResponse = await request(app)
      .post(`/rest/basket/${basketId}/checkout`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        orderDetails: {
          addressId: addressId,
          deliveryMethodId: deliveryMethodId,
          paymentId: paymentId,
        },
      },);
    // 6. Verification
    expect(checkoutResponse.status).to.equal(200);
    expect(checkoutResponse.body.orderConfirmation).to.exist;    
  });
});
