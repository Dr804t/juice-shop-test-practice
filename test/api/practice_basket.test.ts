/*
 * Practice Lab: API Automation (Junior-Middle Level)
 * Objective: Automate the "Add to Basket" flow.
 */

import request from "supertest";
import { expect } from "chai";
import type { Express } from 'express'
import { createTestApp } from './helpers/setup'

let app: Express

describe("Basket API Practice", () => {
  let token: string;
  let basketId: number;

  // Step 1: Initialize app and Login
  before(async () => {
    const result = await createTestApp()
    app = result.app

    const response = await request(app).post("/rest/user/login").send({
      email: "admin@juice-sh.op",
      password: "admin123",
    });

    token = response.body.authentication.token;
    basketId = response.body.authentication.bid;
  });

  it("should add a NEW item to the basket and verify it exists", async () => {
    // 1. Get products and pick one that isn't already in the Admin's basket (Admin has 1, 2, 3)
    const productsResponse = await request(app).get("/api/Products");
    const productId = productsResponse.body.data[9].id; // Pick the 10th product

    // 2. Add to Basket
    const addResponse = await request(app)
      .post("/api/BasketItems")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ProductId: productId,
        BasketId: basketId,
        quantity: 1,
      });

    // Verify addition was successful
    expect(addResponse.status).to.equal(200);
    expect(addResponse.body.status).to.equal('success');

    // 3. Verify the product is actually in the basket
    const basketResponse = await request(app)
      .get(`/rest/basket/${basketId}`)
      .set("Authorization", `Bearer ${token}`);
    
    expect(basketResponse.status).to.equal(200);
    
    const productsInBasket = basketResponse.body.data.Products;
    const isProductFound = productsInBasket.some((product: any) => product.id === productId);
    
    expect(isProductFound).to.equal(true, `Product ID ${productId} should be in the basket list`);
  });

  it("should handle adding a non-existent product gracefully", async () => {
    const invalidProductId = 999999;

    const response = await request(app)
      .post("/api/BasketItems")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ProductId: invalidProductId,
        BasketId: basketId,
        quantity: 1,
      });

    // The API returns 500 because the database foreign key fails
    expect(response.status).to.equal(500);
  });
  
});
