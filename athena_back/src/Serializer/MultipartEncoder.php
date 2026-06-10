<?php

namespace App\Serializer;

use Symfony\Component\Serializer\Encoder\EncoderInterface;

class MultipartEncoder implements EncoderInterface
{
    public function encode(mixed $data, string $format, array $context = []): string
    {
        return json_encode($data);
    }

    public function supportsEncoding(string $format, array $context = []): bool
    {
        return 'multipart' === $format;
    }
}
