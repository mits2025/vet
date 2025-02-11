<!DOCTYPE html>
<html>
<head>
    <title>Vendor Request</title>
</head>
<body>
<h2>New Vendor Request Submitted</h2>

<p><strong>Store Name:</strong> {{ $vendor->store_name }}</p>
<p><strong>Store Address:</strong> {{ $vendor->store_address ?? 'Not Provided' }}</p>
<p><strong>Phone Number:</strong> {{ $phoneNumber }}</p>
<p><strong>Status:</strong> {{ ucfirst($vendor->status->value) }}</p>

<p>Please review the request in the admin panel.</p>

<p>Thank you.</p>
</body>
</html>
