# Specification

## Summary
**Goal:** Build AquaBottle, a product and order management app for packed drinking water in glass bottles, with a customer-facing catalog/ordering flow and an admin dashboard.

**Planned changes:**
- Backend Motoko actor with product catalog management (add, update, delete, list products with fields: id, name, description, volume, pricePerUnit, stockQuantity, isAvailable)
- Backend order management (place order, update status, list/filter orders; stock decrements on order placement)
- Frontend product catalog page displaying product cards (bottle image, name, volume, price, stock level, "Add to Order" button) with out-of-stock indication
- Frontend cart/order summary panel with quantity controls, customer name and contact fields, and order submission with confirmation message
- Frontend admin dashboard with Products tab (add/edit/delete products) and Orders tab (list, filter by status, update status), gated by an admin mode toggle
- Clean, consistent visual theme using white, light aqua, and teal accents with glass-like card effects and minimal sans-serif typography
- Hero banner and bottle illustration served as static assets and displayed on the catalog page and product cards respectively
