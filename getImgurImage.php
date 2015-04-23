<?php


$id = $_GET["imgid"];

$ch = curl_init();

// set url
curl_setopt($ch, CURLOPT_URL, "https://api.imgur.com/3/image/" . $id);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Authorization: Client-ID 044ae818b382c96'
    ));
//return the transfer as a string
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

// $output contains the output string
$output = curl_exec($ch);

// close curl resource to free up system resources
curl_close($ch);
if (json_decode($output)->success) {

echo $output;

} else {


$chh = curl_init();

// set url
curl_setopt($chh, CURLOPT_URL, "https://api.imgur.com/3/album/" . $id);
curl_setopt($chh, CURLOPT_HTTPHEADER, array(
    'Authorization: Client-ID 044ae818b382c96'
    ));
//return the transfer as a string
curl_setopt($chh, CURLOPT_RETURNTRANSFER, 1);

// $output contains the output string
$output = curl_exec($chh);

// close curl resource to free up system resources
curl_close($chh);

echo $output;

}




?>