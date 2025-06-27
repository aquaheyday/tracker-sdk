---
name: Help wanted request
about: Report an issue with the Tracking API
title: "[API Error] "
labels: help wanted
assignees: ''

---
**Environment**  
- API version: v1  
- Client language/SDK: <e.g. JavaScript>

**Request Payload**  
```json
    {
      "tracking_key": "0be8784b-1f93-4793-a05a-c6e5c8deeb09",
      "anon_id": "user-1234",
      "tracking_type": "product_view",
      "common": {
        "referrer": "https://example.com/",
        "page_url": "https://example.com/products/1",
        "page_path": "/products/1",
        "timestamp": "2025-06-27T10:00:00+09:00"
      }
    }
```

**Error Response**  
```json
    {
      "code": "INVALID_REQUEST_BODY",
      "message": "Unable to read request body. Please ensure your request payload is not empty and is valid JSON.",
      "support_url": "https://github.com/aquaheyday/tracker-sdk/issues/new?labels=help%20wanted&template=help_wanted_request.md&title=%5BAPI%20Error%5D%20Invalid%20Request%20Body"
    }
```

**Additional info**  
- Timestamp: (server log time)  
- Other details:
