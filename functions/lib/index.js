"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.onNewOfferSendNotification = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
// This function triggers when a new offer is created in Firestore.
exports.onNewOfferSendNotification = functions.firestore
    .document("offers/{offerId}")
    .onCreate(async (snap) => {
    const newOffer = snap.data();
    functions.logger.info(`New offer created: ${newOffer.title}`, {
        structuredData: true,
    });
    // 1. Get all followers from the 'followers' collection.
    const followersSnapshot = await db.collection("followers").get();
    if (followersSnapshot.empty) {
        functions.logger.info("No followers to notify.");
        return;
    }
    const followers = followersSnapshot.docs.map((doc) => doc.data());
    functions.logger.info(`Found ${followers.length} followers to notify.`, followers.map((f) => f.email));
    // --- TODO: Add notification logic here ---
    // In the next step, we can integrate an email service (like SendGrid)
    // or push notifications (FCM) to send a message to each follower.
    // For example, we could create a batch write to a new 'notifications'
    // collection that the app could then display to the user.
    return;
});
//# sourceMappingURL=index.js.map