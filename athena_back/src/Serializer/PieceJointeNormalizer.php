<?php

// namespace App\Serializer;

// use App\Entity\PieceJointe;
// use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
// use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
// use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
// use Vich\UploaderBundle\Storage\StorageInterface;

// final class PieceJointeNormalizer implements NormalizerInterface, NormalizerAwareInterface
// {
//     use NormalizerAwareTrait;

//     private const ALREADY_CALLED = 'PIECE_JOINTE_NORMALIZER_ALREADY_CALLED';

//     public function __construct(private StorageInterface $storage)
//     {
//     }

//     public function normalize(mixed $object, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
//     {
//         $context[self::ALREADY_CALLED] = true;
    
//         try {
//             $object->contentUrl = $this->storage->resolveUri($object, 'file');
//             $result = $this->normalizer->normalize($object, $format, $context);
//             gc_collect_cycles(); // Libération explicite de la mémoire
//             return $result;
//         } catch (\Exception $e) {
//             gc_collect_cycles();
//             return null;
//         }
//     }
    

//     public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
//     {
//         if (isset($context[self::ALREADY_CALLED])) {
//             return false;
//         }

//         return $data instanceof PieceJointe;
//     }

//     public function getSupportedTypes(?string $format): array
//     {
//         return [
//             PieceJointe::class => true
//         ];
//     }
// }


namespace App\Serializer;

use App\Entity\PieceJointe;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Vich\UploaderBundle\Storage\StorageInterface;

final class PieceJointeNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'PIECE_JOINTE_NORMALIZER_ALREADY_CALLED';

    public function __construct(private StorageInterface $storage)
    {
    }

    public function normalize(mixed $object, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        $context[self::ALREADY_CALLED] = true;
    
        try {
            $object->contentUrl = $this->storage->resolveUri($object, 'file');
            $result = $this->normalizer->normalize($object, $format, $context);
            gc_collect_cycles(); // Libération explicite de la mémoire
            return $result;
        } catch (\Exception $e) {
            gc_collect_cycles();
            return null;
        }
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof PieceJointe;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            PieceJointe::class => true
        ];
    }
}
