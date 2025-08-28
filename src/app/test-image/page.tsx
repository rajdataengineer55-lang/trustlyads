
import Image from "next/image";

export default function OfferImagePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Test Image Page</h1>
      <Image
        src="https://firebasestorage.googleapis.com/v0/b/localpulse-9e3lz.firebasestorage.app/o/offers%2F95bc76b4-155c-407e-a079-26e756e9f1be-entrance.jpg?alt=media&token=cc5f1cbf-0c62-49d0-b8fa-01f9fd489bf7"
        alt="Offer Image"
        width={600}
        height={400}
      />
    </div>
  );
}
