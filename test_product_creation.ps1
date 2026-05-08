
$baseUrl = "http://localhost:8081/api"
$sellerId = 3 # Demo Seller in PostgreSQL

function Test-Endpoint {
    param($method, $path, $body)
    $url = "$baseUrl$path"
    Write-Host "`nTesting $method $url" -ForegroundColor Cyan
    try {
        if ($body) {
            $jsonBody = $body | ConvertTo-Json -Depth 10
            # Write-Host "Body: $jsonBody" -ForegroundColor Gray
            $response = Invoke-RestMethod -Uri $url -Method $method -Body $jsonBody -ContentType "application/json"
        } else {
            $response = Invoke-RestMethod -Uri $url -Method $method
        }
        Write-Host "SUCCESS" -ForegroundColor Green
        return $response
    } catch {
        Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errorBody = $reader.ReadToEnd()
            Write-Host "Error Body: $errorBody" -ForegroundColor Yellow
        }
        return $null
    }
}

# 1. Create a product with a category from the dropdown list
$productBody = @{
    name = "New Test Product $(Get-Random)"
    description = "Test description"
    price = 999.99
    category = "Handicrafts"
    imageUrl = "/product-images/wooden-elephant.svg"
    isTrending = $true
    sourcePlatform = "Local"
    productUrl = ""
    sellerId = $sellerId
    stockQuantity = 50
}

$newProduct = Test-Endpoint "POST" "/products" $productBody

if ($newProduct) {
    $newProductId = $newProduct.id
    Write-Host "Created Product ID: $newProductId" -ForegroundColor Yellow

    # 2. Check if it appears in all products
    $allProducts = Test-Endpoint "GET" "/products"
    $foundInAll = $allProducts | Where-Object { $_.id -eq $newProductId }
    if ($foundInAll) {
        Write-Host "FOUND in all products list!" -ForegroundColor Green
    } else {
        Write-Host "NOT FOUND in all products list!" -ForegroundColor Red
    }

    # 3. Check if it appears in seller products
    $sellerProducts = Test-Endpoint "GET" "/products/seller/$sellerId"
    $foundInSeller = $sellerProducts | Where-Object { $_.id -eq $newProductId }
    if ($foundInSeller) {
        Write-Host "FOUND in seller products list!" -ForegroundColor Green
    } else {
        Write-Host "NOT FOUND in seller products list!" -ForegroundColor Red
    }
}
