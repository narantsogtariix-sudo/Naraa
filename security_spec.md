# Security Specification: Zero-Trust Firestore Security

## Data Invariants
1. **Public Submissions (Create-Only)**: Anyone (unauthenticated guests) can create document entries in the `contact_requests` and `orders` collections.
2. **Admin-Only Reads/Updates**: Only authenticated admin users (specifically users signed in, with auth email checking or generic signed-in checks for the admin panel) can read, query, list, update, or delete records.
3. **No Update-Gaps**: All status field updates must transition to valid state values. Immutables like `createdAt` cannot be modified.
4. **Denial of Wallet Defense**: Enforce strict string size boundaries on name, phone, message, and emails. Document IDs must be validated.

---

## The "Dirty Dozen" Payloads (Malicious Attempts)

### `contact_requests` Collection Attacks
1. **Unauthenticated Read Attempt** (Identity Leak): Guest tries to fetch all contact requests.
   - *Expected*: `PERMISSION_DENIED`
2. **Anonymous Status Poisoning on Create**: Guest submits contact request with `status: "Resolved"`.
   - *Expected*: `PERMISSION_DENIED` (New submissions must be `Unread`)
3. **Huge Text Injection (Denial of Wallet)**: Guest submits 50KB string in `name` field.
   - *Expected*: `PERMISSION_DENIED` (Strict size limit of <= 100 characters)
4. **Invalid Field injection**: Guest submits contact request with an unapproved key like `isVerified: true`.
   - *Expected*: `PERMISSION_DENIED` (Strict schema key matching)
5. **Modified Immutable Field**: Admin/Guest tries to update `createdAt` timestamp.
   - *Expected*: `PERMISSION_DENIED`
6. **Self-Appointed Note Addition**: Guest attempts to update a contact request to add their own internal notes.
   - *Expected*: `PERMISSION_DENIED` (Write / update restricted to admins)

### `orders` Collection Attacks
7. **Unauthenticated Query / Listing Attempt**: Guest tries to query or fetch a specific order document.
   - *Expected*: `PERMISSION_DENIED`
8. **Malicious Price Modification on Create**: Guest tries to submit order with `price: "$0.00"` or extremely long prices.
   - *Expected*: `PERMISSION_DENIED` (Price must be valid format and reasonable size)
9. **Negative Quantity submission**: Guest submits order with `quantity: -5`.
   - *Expected*: `PERMISSION_DENIED` (Quantity must be >= 1)
10. **Status Hijacking on Create**: Guest tries to submit order with `status: "Delivered"`.
    - *Expected*: `PERMISSION_DENIED` (Must start with `New`)
11. **Guest Delete Attempt**: Guest attempts to delete a submitted order.
    - *Expected*: `PERMISSION_DENIED`
12. **Unauthenticated Note Injection**: Guest tries to add standard notes to an order.
    - *Expected*: `PERMISSION_DENIED`

---

## Test Runner: `firestore.rules.test.ts`
*(Note: Placed here as part of our Phase 0 Specification)*

```typescript
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

let testEnv: RulesTestEnvironment;

describe("Firestore Security Rules Tests", () => {
  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "natso-clothing",
      firestore: {
        rules: `
          rules_version = '2';
          service cloud.firestore {
            // Rules here
          }
        `,
      },
    });
  });

  after(async () => {
    await testEnv.cleanup();
  });

  it("blocks guest read on contact_requests", async () => {
    const context = testEnv.unauthenticatedContext();
    const db = context.firestore();
    await assertFails(getDoc(doc(db, "contact_requests", "request123")));
  });

  it("blocks malicious status on guest create in contact_requests", async () => {
    const context = testEnv.unauthenticatedContext();
    const db = context.firestore();
    await assertFails(
      setDoc(doc(db, "contact_requests", "request123"), {
        name: "Test User",
        phone: "99009900",
        status: "Resolved", // Poison status
        createdAt: new Date(),
        notes: [],
      })
    );
  });
});
```
