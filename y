{
  "indexes": [],
  "fieldOverrides": [
    {
      "collectionGroup": "reviews",
      "fieldPath": "createdAt",
      "ttl": false,
      "indexes": [
        {
          "order": "ASCENDING",
          "queryScope": "COLLECTION"
        },
        {
          "order": "DESCENDING",
          "queryScope": "COLLECTION"
        },
        {
          "arrayConfig": "CONTAINS",
          "queryScope": "COLLECTION"
        },
        {
          "order": "DESCENDING",
          "queryScope": "COLLECTION_GROUP"
        }
      ]
    }
  ]
}