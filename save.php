<?php

$filePath = 'uploads/' . $_POST['video-filename'];

$tempName = $_FILES['video-blob']['tmp_name'];

if (!move_uploaded_file($tempName, $filePath)) {
    echo 'Problem saving file: '.$tempName;
    die();
}

echo 'success';
?>