<?php

namespace App\DataFixtures;

use App\Entity\FonctionSousMenu;
use App\Entity\TacheFacturable;
use App\Entity\Fournisseur;
use App\Entity\Menu;
use App\Entity\TypeChiffrage;
use App\Entity\Role;
use App\Entity\SousMenu;
use App\Entity\Utilisateur;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(private UserPasswordHasherInterface $hasher) {}

    public function load(ObjectManager $manager): void
    {
        // Tâches facturables
        $taches = [
            ['HD', 'Heure de découpe', true, 'Production'],
            ['HU', 'Heure d’usinage', true, 'Production'],
            ['HPP', 'Heure de placage et de ponçage', true, 'Production'],
            ['HTR', 'Heure de travail sur la résine', true, 'Production'],
            ['HMA', 'Heure de montage atelier', true, 'Production'],
            ['HNE', 'Heure de nettoyage, emballage avant livraison', true, 'Production'],
            ['HEM', 'Heure d’entretien Machines', false, 'Production'],
            ['HNA', 'Heure de nettoyage Atelier', false, 'Production'],
            ['HRA', 'Heure de rangement Atelier', false, 'Production'],
            ['HVSC', 'Heure de visite sur site client', true, 'Installation'],
            ['HFC', 'Heure de formation client', true, 'Installation'],
            ['HMSC', 'Heure de montage sur site client', true, 'Installation'],
            ['HLR', 'Heure de levée de réserves', true, 'Installation'],
            ['HGPA-RT', 'Heure de GPA et de réception de travaux', true, 'Installation'],
            ['HB', 'Heure bureau de méthodes', false, 'Autres'],
        ];

        foreach ($taches as $t) {
            $tache = new TacheFacturable();
            $tache->setCode($t[0])
                ->setNom($t[1])
                ->setCoutHoraire(rand(10, 80))
                ->setFacturable($t[2])
                ->setCategorie($t[3]);
            $manager->persist($tache);
        }

        // Fournisseurs
        $fournisseurs = [
            ['Fourniture & Co', '0341234567', 'contact@fournitureco.com', 'Antananarivo, Madagascar'],
            ['Matériel Plus', '0329876543', 'info@materielplus.mg', 'Toamasina, Madagascar'],
            ['Quincaillerie Express', '0331122334', 'service@quincaillerie-express.com', 'Fianarantsoa, Madagascar'],
            ['Accessoires Tech', '0342244668', 'support@accessoires-tech.mg', 'Mahajanga, Madagascar'],
            ['Outillage Global', '0325566778', 'sales@outillageglobal.mg', 'Toliara, Madagascar'],
        ];

        foreach ($fournisseurs as $f) {
            $fournisseur = new Fournisseur();
            $fournisseur->setNom($f[0])
                ->setTelephone($f[1])
                ->setEmail($f[2])
                ->setAdresse($f[3]);
            $manager->persist($fournisseur);
        }

        // Types de chiffrage
        $typesChiffrage = ['Matières premières', 'Quincailleries de base', 'Accessoires spécifiques', 'Forfait fournitures d’installation', 'Complément d’achats'];

        foreach ($typesChiffrage as $type) {
            $typeChiffrage = new TypeChiffrage();
            $typeChiffrage->setNom($type);
            $manager->persist($typeChiffrage);
        }

        // Rôles
        $roles = [
            ['Dir', 'Direction', 1],
            ['BET', 'Bureau d\'Etude Technique', 1],
            ['RP', 'Responsable de Production', 1],
            ['T', 'Technicien', 1.5],
            ['OS', 'Ouvrier Spécialisé', 1],
            ['M', 'Manoeuvre', 0.8],
        ];

        $demoUsers = [
            'Dir' => ['Direction', 'Admin',       'admin@athena.mg',      'Admin@1234'],
            'BET' => ['Bureau d\'Etude Technique', 'Rakoto', 'bet@athena.mg', 'Bet@1234'],
            'RP'  => ['Responsable de Production', 'Rabe',  'rp@athena.mg',  'Rp@1234'],
            'T'   => ['Technicien',                'Raivo', 'technicien@athena.mg', 'Tech@1234'],
            'OS'  => ['Ouvrier Spécialisé',        'Solo',  'os@athena.mg',  'Os@1234'],
            'M'   => ['Manoeuvre',                 'Hery',  'manoeuvre@athena.mg',  'Man@1234'],
        ];

        foreach ($roles as $r) {
            $role = new Role();
            $role->setCode($r[0])
                ->setNom($r[1])
                ->setCoefficientQualification($r[2]);
            $manager->persist($role);

            if (isset($demoUsers[$r[0]])) {
                [$roleNom, $nom, $email, $plainPassword] = $demoUsers[$r[0]];
                $user = new Utilisateur();
                $user->setNom($nom)
                     ->setPrenoms($roleNom)
                     ->setEmail($email)
                     ->setPassword($this->hasher->hashPassword($user, $plainPassword))
                     ->setRole($role)
                     ->setActif(true);
                $manager->persist($user);
            }
        }

        // Menu 1: Dashboard
        $dashboard = new Menu();
        $dashboard->setCode('DASH')
                 ->setNom('Dashboard');
        $manager->persist($dashboard);

        $affaire = new SousMenu();
        $affaire->setCode('AFF')
                ->setNom('Affaire')
                ->setMenu($dashboard);
        $manager->persist($affaire);

        $lire = new FonctionSousMenu();
        $lire->setCode('READ')
             ->setNom('lire')
             ->setSousmenu($affaire);
        $manager->persist($lire);

        // Menu 2: Administrateur
        $admin = new Menu();
        $admin->setCode('ADM')
              ->setNom('Administrateur');
        $manager->persist($admin);

        $utilisateur = new SousMenu();
        $utilisateur->setCode('USR')
                   ->setNom('Utilisateur')
                   ->setMenu($admin);
        $manager->persist($utilisateur);

        $statistique = new SousMenu();
        $statistique->setCode('STAT')
                   ->setNom('Statistique')
                   ->setMenu($admin);
        $manager->persist($statistique);

        $chiffrage = new SousMenu();
        $chiffrage->setCode('CHIF')
                 ->setNom('Chiffrage')
                 ->setMenu($admin);
        $manager->persist($chiffrage);

        // Menu 3: Paramètre Intranet
        $param = new Menu();
        $param->setCode('PARA')
              ->setNom('Paramètre Intranet');
        $manager->persist($param);

        // Menu 4: Ordre de fabrication
        $of = new Menu();
        $of->setCode('OF')
           ->setNom('Ordre de fabrication');
        $manager->persist($of);

        $validateur = new FonctionSousMenu();
        $validateur->setCode('VAL')
                  ->setNom('validateur');
        $manager->persist($validateur);

        // Menu 5: Rapport journalier
        $rapport = new Menu();
        $rapport->setCode('RAP')
               ->setNom('Rapport journalier');
        $manager->persist($rapport);

        $validateurRap = new SousMenu();
        $validateurRap->setCode('VALI')
                     ->setNom('validateur')
                     ->setMenu($rapport);
        $manager->persist($validateurRap);

        // Menu 6: Messagerie Interne
        $msg = new Menu();
        $msg->setCode('MSG')
            ->setNom('Messagerie Interne');
        $manager->persist($msg);

        // Menu 7: Agendas
        $agenda = new Menu();
        $agenda->setCode('AGD')
               ->setNom('Agendas');
        $manager->persist($agenda);

        // Enregistrement en base
        $manager->flush();
    }
}
