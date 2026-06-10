<?php

namespace App\Serializer;

use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Serializer\Encoder\DecoderInterface;

final class MultipartDecoder implements DecoderInterface
{
    public function __construct(
        private RequestStack $requestStack
    ) {
    }

    public function decode(string $data, string $format, array $context = []): ?array
    {
        $request = $this->requestStack->getCurrentRequest();
        if (!$request) {
            return null;
        }

        return array_map(static function ($element) {
            if ($element instanceof \Symfony\Component\HttpFoundation\File\UploadedFile) {
                return $element;
            }
            return null;
        }, $request->files->all()) + $request->request->all();
    }

    public function supportsDecoding(string $format, array $context = []): bool
    {
        return 'multipart' === $format;
    }
}
