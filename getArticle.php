<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
$url = $_GET['url'];

// Get cURL resource
$curl = curl_init();
// Set some options - we are passing in a useragent too here
curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => "https://www.readability.com/api/content/v1/parser?url=" . $url . "&token=1a6b76b1fe9e59026b8edcb17fb98aa89c4fd2ff",
    CURLOPT_USERAGENT => 'Codular Sample cURL Request'
));
// Send the request & save response to $resp
$resp = curl_exec($curl);
// Close request to clear up some resources
curl_close($curl);

echo $resp;


?>