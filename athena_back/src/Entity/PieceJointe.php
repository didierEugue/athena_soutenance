<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\OpenApi\Model;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

#[ORM\Entity]
#[ApiResource(
    // operations: [
    //     new Get(normalizationContext: ['groups' => ['piece_jointe:read']]),
    //     new GetCollection(normalizationContext: ['groups' => ['piece_jointe:read']]),
    //     new Post(
    //         formats: ['multipart' => ['multipart/form-data'], 'json' => ['application/json']], // Ajout du format JSON
    //         normalizationContext: ['groups' => ['piece_jointe:read']],
    //         denormalizationContext: ['groups' => ['piece_jointe:write']],
    //         validationContext: ['groups' => ['piece_jointe:write']],
    //         inputFormats: ['multipart' => ['multipart/form-data']],
    //         outputFormats: ['json' => ['application/json']], // Ajout de cette ligne
    //         openapi: new Model\Operation(
    //             requestBody: new Model\RequestBody(
    //                 content: new \ArrayObject([
    //                     'multipart/form-data' => [
    //                         'schema' => [
    //                             'type' => 'object',
    //                             'properties' => [
    //                                 'file' => [
    //                                     'type' => 'string',
    //                                     'format' => 'binary'
    //                                 ]
    //                             ]
    //                         ]
    //                     ]
    //                 ])
    //             )
    //         )
    //     ),        
    //     new Delete()
    // ],
    // operations: [
    //     new Get(
    //         normalizationContext: ['groups' => ['piece_jointe:read']],
    //         security: "is_granted('ROLE_USER')"
    //     ),
    //     new GetCollection(
    //         normalizationContext: ['groups' => ['piece_jointe:read']],
    //         security: "is_granted('ROLE_USER')"
    //     ),
    //     new Post(
    //         formats: ['multipart' => ['multipart/form-data']],
    //         normalizationContext: ['groups' => ['piece_jointe:read']],
    //         denormalizationContext: ['groups' => ['piece_jointe:write']],
    //         validationContext: ['groups' => ['piece_jointe:write']],
    //         inputFormats: ['multipart' => ['multipart/form-data']],
    //         security: "is_granted('ROLE_USER')"
    //     ),
    //     new Delete(security: "is_granted('ROLE_USER')")
    // ],
    operations: [
        new Get(normalizationContext: ['groups' => ['piece_jointe:read']]),
        new GetCollection(normalizationContext: ['groups' => ['piece_jointe:read']]),
        new Post(
            formats: ['multipart' => ['multipart/form-data']],
            normalizationContext: ['groups' => ['piece_jointe:read']],
            denormalizationContext: ['groups' => ['piece_jointe:write']],
            validationContext: ['groups' => ['piece_jointe:write']],
            inputFormats: ['multipart' => ['multipart/form-data']],
            openapi: new Model\Operation(
                requestBody: new Model\RequestBody(
                    content: new \ArrayObject([
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'file' => [
                                        'type' => 'string',
                                        'format' => 'binary'
                                    ]
                                ]
                            ]
                        ]
                    ])
                )
            )
        ),
        new Delete()
    ],
    order: ['createdAt' => 'DESC'],
    paginationEnabled: true,
    paginationItemsPerPage: 10
)]

#[Vich\Uploadable]
class PieceJointe
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['piece_jointe:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['piece_jointe:read'])]
    private ?string $fileName = null;

    #[ApiProperty(types: ['https://schema.org/contentUrl'])]
    #[Groups(['piece_jointe:read'])]
    public ?string $contentUrl = null;

    #[Vich\UploadableField(mapping: 'piece_jointe', fileNameProperty: 'fileName')]
    #[Assert\NotNull(groups: ['piece_jointe:write'])]
    #[Assert\File(
        maxSize: '5M',
        mimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png'
        ],
        mimeTypesMessage: 'Veuillez télécharger un fichier PDF, DOC, DOCX, JPG, JPEG ou PNG'
    )]
    #[Groups(['piece_jointe:write'])]
    private ?File $file = null;

    #[ORM\Column(length: 255)]
    #[Groups(['piece_jointe:read'])]
    private ?string $mimeType = null;

    #[ORM\Column]
    #[Groups(['piece_jointe:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFileName(): ?string
    {
        return $this->fileName;
    }

    public function setFileName(?string $fileName): self
    {
        $this->fileName = $fileName;
        return $this;
    }

    public function getFile(): ?File
    {
        return $this->file;
    }

    public function setFile(?File $file): self
    {
        $this->file = $file;
        if ($file) {
            $this->updatedAt = new \DateTimeImmutable();
            $this->mimeType = $file->getMimeType();
        }
        return $this;
    }

    public function getMimeType(): ?string
    {
        return $this->mimeType;
    }

    public function setMimeType(string $mimeType): self
    {
        $this->mimeType = $mimeType;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }
}
