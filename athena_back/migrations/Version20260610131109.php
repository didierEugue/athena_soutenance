<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260610131109 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE acces_par_defaut (id INT AUTO_INCREMENT NOT NULL, role_id INT NOT NULL, menu_id INT NOT NULL, INDEX IDX_65555A63D60322AC (role_id), INDEX IDX_65555A63CCD7E912 (menu_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE acces_personnalise (id INT AUTO_INCREMENT NOT NULL, utilisateur_id INT NOT NULL, menu_id INT NOT NULL, fonction_id INT NOT NULL, INDEX IDX_E3B0A804FB88E14F (utilisateur_id), INDEX IDX_E3B0A804CCD7E912 (menu_id), INDEX IDX_E3B0A80457889920 (fonction_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE affaire (id INT AUTO_INCREMENT NOT NULL, client_id INT DEFAULT NULL, numero VARCHAR(20) NOT NULL, nom VARCHAR(200) NOT NULL, description LONGTEXT DEFAULT NULL, date_creation DATETIME DEFAULT NULL, date_cloture DATETIME DEFAULT NULL, cout_total NUMERIC(10, 2) DEFAULT NULL, statut ENUM(\'standby\', \'en_cours\', \'terminé\', \'cloture\', \'archive\') NOT NULL DEFAULT \'standby\', INDEX IDX_9C3F18EF19EB6921 (client_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE agenda (id INT AUTO_INCREMENT NOT NULL, expediteur_id INT NOT NULL, destinataire_id INT NOT NULL, date_debut DATETIME NOT NULL, date_fin DATETIME NOT NULL, titre VARCHAR(50) NOT NULL, description VARCHAR(255) DEFAULT NULL, importance VARCHAR(50) NOT NULL, type VARCHAR(20) NOT NULL, statut ENUM(\'standby\',\'terminé\') NOT NULL DEFAULT \'standby\', INDEX IDX_2CEDC87710335F61 (expediteur_id), INDEX IDX_2CEDC877A4F84F6E (destinataire_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE chiffrage (id INT AUTO_INCREMENT NOT NULL, type_id INT NOT NULL, affaire_id INT NOT NULL, fournisseur_id INT NOT NULL, cout DOUBLE PRECISION NOT NULL, INDEX IDX_C95FD4EAC54C8C93 (type_id), INDEX IDX_C95FD4EAF082E755 (affaire_id), INDEX IDX_C95FD4EA670C757F (fournisseur_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE client (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(100) NOT NULL, telephone VARCHAR(20) DEFAULT NULL, email VARCHAR(100) NOT NULL, adresse LONGTEXT DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE consigne (id INT AUTO_INCREMENT NOT NULL, expediteur_id INT NOT NULL, destinataire_id INT DEFAULT NULL, titre VARCHAR(30) NOT NULL, type VARCHAR(15) NOT NULL, contenu VARCHAR(255) NOT NULL, etat VARCHAR(10) NOT NULL, date_creation DATETIME DEFAULT NULL, date_echeance DATETIME DEFAULT NULL, priorite VARCHAR(30) NOT NULL, INDEX IDX_72406DA10335F61 (expediteur_id), INDEX IDX_72406DAA4F84F6E (destinataire_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE fichiers (id INT AUTO_INCREMENT NOT NULL, utilisateur_id INT DEFAULT NULL, ofab_id INT DEFAULT NULL, rja_id INT DEFAULT NULL, mg_id INT DEFAULT NULL, message_prive_id INT DEFAULT NULL, nom VARCHAR(255) NOT NULL, chemin VARCHAR(255) NOT NULL, mime_type VARCHAR(100) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_969DB4ABFB88E14F (utilisateur_id), INDEX IDX_969DB4AB92427262 (ofab_id), INDEX IDX_969DB4AB3E30EEC1 (rja_id), INDEX IDX_969DB4AB98719779 (mg_id), INDEX IDX_969DB4AB77321B04 (message_prive_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE fonction (id INT AUTO_INCREMENT NOT NULL, code VARCHAR(50) NOT NULL, nom VARCHAR(100) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE fonction_sous_menu (id INT AUTO_INCREMENT NOT NULL, sousmenu_id INT DEFAULT NULL, code VARCHAR(4) NOT NULL, nom VARCHAR(255) NOT NULL, INDEX IDX_E9484EEE5FBFC66 (sousmenu_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE fournisseur (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, telephone VARCHAR(20) DEFAULT NULL, email VARCHAR(100) NOT NULL, adresse LONGTEXT DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE menu (id INT AUTO_INCREMENT NOT NULL, code VARCHAR(50) NOT NULL, nom VARCHAR(100) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE message (id INT AUTO_INCREMENT NOT NULL, expediteur_id INT NOT NULL, destinataire_id INT NOT NULL, contenu LONGTEXT NOT NULL, date_envoie DATETIME NOT NULL, statut TINYINT(1) NOT NULL, INDEX IDX_B6BD307F10335F61 (expediteur_id), INDEX IDX_B6BD307FA4F84F6E (destinataire_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE message_groupe (id INT AUTO_INCREMENT NOT NULL, objet_id INT NOT NULL, expediteur_id INT NOT NULL, role_id INT NOT NULL, participant_id INT DEFAULT NULL, contenu LONGTEXT NOT NULL, date_envoi DATETIME NOT NULL, INDEX IDX_339E112EF520CF5A (objet_id), INDEX IDX_339E112E10335F61 (expediteur_id), INDEX IDX_339E112ED60322AC (role_id), INDEX IDX_339E112E9D1C3019 (participant_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE objet (id INT AUTO_INCREMENT NOT NULL, objet_discussion VARCHAR(255) NOT NULL, statut ENUM(\'Actif\', \'Résolue\', \'Archivé\') NOT NULL DEFAULT \'Actif\', reponse LONGTEXT DEFAULT NULL, archiver TINYINT(1) NOT NULL, nature VARCHAR(100) NOT NULL, date_creation DATETIME DEFAULT NULL, date_resolu DATETIME DEFAULT NULL, date_archive DATETIME DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE ordre_fabrication (id INT AUTO_INCREMENT NOT NULL, affaire_id INT NOT NULL, numero VARCHAR(15) NOT NULL, nom VARCHAR(100) NOT NULL, description LONGTEXT NOT NULL, date_cloture DATETIME DEFAULT NULL, indice SMALLINT NOT NULL, statut ENUM(\'standby\', \'en_cours\', \'terminé\', \'annulé\') NOT NULL DEFAULT \'standby\', INDEX IDX_7FB222D2F082E755 (affaire_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE participant (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE participants_groupe (id INT AUTO_INCREMENT NOT NULL, participant_id INT NOT NULL, utilisateur_id INT NOT NULL, INDEX IDX_C95ED3B39D1C3019 (participant_id), INDEX IDX_C95ED3B3FB88E14F (utilisateur_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE piece_jointe (id INT AUTO_INCREMENT NOT NULL, file_name VARCHAR(255) NOT NULL, mime_type VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE role (id INT AUTO_INCREMENT NOT NULL, code VARCHAR(10) NOT NULL, nom VARCHAR(50) NOT NULL, coefficient_qualification NUMERIC(3, 2) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE sous_menu (id INT AUTO_INCREMENT NOT NULL, menu_id INT DEFAULT NULL, code VARCHAR(4) NOT NULL, nom VARCHAR(255) NOT NULL, INDEX IDX_F30864DFCCD7E912 (menu_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE tache_facturable (id INT AUTO_INCREMENT NOT NULL, code VARCHAR(8) NOT NULL, nom VARCHAR(100) NOT NULL, cout_horaire NUMERIC(10, 2) NOT NULL, facturable TINYINT(1) NOT NULL, categorie ENUM(\'Production\', \'Installation\', \'Autres\') NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE tache_par_activite (id INT AUTO_INCREMENT NOT NULL, tache_facturable_id INT NOT NULL, ordre_fabrication_id INT NOT NULL, executeur_id INT NOT NULL, validateur_id INT DEFAULT NULL, type_activite VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, duree NUMERIC(5, 2) DEFAULT NULL, date DATETIME NOT NULL, statut ENUM(\'Standby\', \'Réfusé\', \'Validé\') NOT NULL DEFAULT \'Standby\', INDEX IDX_DD323A2DF7CF095C (tache_facturable_id), INDEX IDX_DD323A2D6A91B091 (ordre_fabrication_id), INDEX IDX_DD323A2D104FF23B (executeur_id), INDEX IDX_DD323A2DE57AEF2F (validateur_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE type_chiffrage (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE utilisateur (id INT AUTO_INCREMENT NOT NULL, role_id INT NOT NULL, email VARCHAR(180) NOT NULL, password VARCHAR(255) NOT NULL, nom VARCHAR(100) NOT NULL, prenoms VARCHAR(100) DEFAULT NULL, telephone VARCHAR(20) DEFAULT NULL, adresse VARCHAR(255) DEFAULT NULL, date_creation DATETIME DEFAULT NULL, date_modif DATETIME DEFAULT NULL, actif TINYINT(1) NOT NULL, INDEX IDX_1D1C63B3D60322AC (role_id), UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0E3BD61CE16BA31DBBF396750 (queue_name, available_at, delivered_at, id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE acces_par_defaut ADD CONSTRAINT FK_65555A63D60322AC FOREIGN KEY (role_id) REFERENCES role (id)');
        $this->addSql('ALTER TABLE acces_par_defaut ADD CONSTRAINT FK_65555A63CCD7E912 FOREIGN KEY (menu_id) REFERENCES menu (id)');
        $this->addSql('ALTER TABLE acces_personnalise ADD CONSTRAINT FK_E3B0A804FB88E14F FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id)');
        $this->addSql('ALTER TABLE acces_personnalise ADD CONSTRAINT FK_E3B0A804CCD7E912 FOREIGN KEY (menu_id) REFERENCES menu (id)');
        $this->addSql('ALTER TABLE acces_personnalise ADD CONSTRAINT FK_E3B0A80457889920 FOREIGN KEY (fonction_id) REFERENCES fonction (id)');
        $this->addSql('ALTER TABLE affaire ADD CONSTRAINT FK_9C3F18EF19EB6921 FOREIGN KEY (client_id) REFERENCES client (id)');
        $this->addSql('ALTER TABLE agenda ADD CONSTRAINT FK_2CEDC87710335F61 FOREIGN KEY (expediteur_id) REFERENCES utilisateur (id)');
        $this->addSql('ALTER TABLE agenda ADD CONSTRAINT FK_2CEDC877A4F84F6E FOREIGN KEY (destinataire_id) REFERENCES utilisateur (id)');
        $this->addSql('ALTER TABLE chiffrage ADD CONSTRAINT FK_C95FD4EAC54C8C93 FOREIGN KEY (type_id) REFERENCES type_chiffrage (id)');
        $this->addSql('ALTER TABLE chiffrage ADD CONSTRAINT FK_C95FD4EAF082E755 FOREIGN KEY (affaire_id) REFERENCES affaire (id)');
        $this->addSql('ALTER TABLE chiffrage ADD CONSTRAINT FK_C95FD4EA670C757F FOREIGN KEY (fournisseur_id) REFERENCES fournisseur (id)');
        $this->addSql('ALTER TABLE consigne ADD CONSTRAINT FK_72406DA10335F61 FOREIGN KEY (expediteur_id) REFERENCES utilisateur (id)');
        $this->addSql('ALTER TABLE consigne ADD CONSTRAINT FK_72406DAA4F84F6E FOREIGN KEY (destinataire_id) REFERENCES utilisateur (id)');
        $this->addSql('ALTER TABLE fichiers ADD CONSTRAINT FK_969DB4ABFB88E14F FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id)');
        $this->addSql('ALTER TABLE fichiers ADD CONSTRAINT FK_969DB4AB92427262 FOREIGN KEY (ofab_id) REFERENCES ordre_fabrication (id)');
        $this->addSql('ALTER TABLE fichiers ADD CONSTRAINT FK_969DB4AB3E30EEC1 FOREIGN KEY (rja_id) REFERENCES tache_par_activite (id)');
        $this->addSql('ALTER TABLE fichiers ADD CONSTRAINT FK_969DB4AB98719779 FOREIGN KEY (mg_id) REFERENCES message_groupe (id)');
        $this->addSql('ALTER TABLE fichiers ADD CONSTRAINT FK_969DB4AB77321B04 FOREIGN KEY (message_prive_id) REFERENCES message (id)');
        $this->addSql('ALTER TABLE fonction_sous_menu ADD CONSTRAINT FK_E9484EEE5FBFC66 FOREIGN KEY (sousmenu_id) REFERENCES sous_menu (id)');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F10335F61 FOREIGN KEY (expediteur_id) REFERENCES utilisateur (id)');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307FA4F84F6E FOREIGN KEY (destinataire_id) REFERENCES utilisateur (id)');
        $this->addSql('ALTER TABLE message_groupe ADD CONSTRAINT FK_339E112EF520CF5A FOREIGN KEY (objet_id) REFERENCES objet (id)');
        $this->addSql('ALTER TABLE message_groupe ADD CONSTRAINT FK_339E112E10335F61 FOREIGN KEY (expediteur_id) REFERENCES utilisateur (id)');
        $this->addSql('ALTER TABLE message_groupe ADD CONSTRAINT FK_339E112ED60322AC FOREIGN KEY (role_id) REFERENCES role (id)');
        $this->addSql('ALTER TABLE message_groupe ADD CONSTRAINT FK_339E112E9D1C3019 FOREIGN KEY (participant_id) REFERENCES participant (id)');
        $this->addSql('ALTER TABLE ordre_fabrication ADD CONSTRAINT FK_7FB222D2F082E755 FOREIGN KEY (affaire_id) REFERENCES affaire (id)');
        $this->addSql('ALTER TABLE participants_groupe ADD CONSTRAINT FK_C95ED3B39D1C3019 FOREIGN KEY (participant_id) REFERENCES participant (id)');
        $this->addSql('ALTER TABLE participants_groupe ADD CONSTRAINT FK_C95ED3B3FB88E14F FOREIGN KEY (utilisateur_id) REFERENCES utilisateur (id)');
        $this->addSql('ALTER TABLE sous_menu ADD CONSTRAINT FK_F30864DFCCD7E912 FOREIGN KEY (menu_id) REFERENCES menu (id)');
        $this->addSql('ALTER TABLE tache_par_activite ADD CONSTRAINT FK_DD323A2DF7CF095C FOREIGN KEY (tache_facturable_id) REFERENCES tache_facturable (id)');
        $this->addSql('ALTER TABLE tache_par_activite ADD CONSTRAINT FK_DD323A2D6A91B091 FOREIGN KEY (ordre_fabrication_id) REFERENCES ordre_fabrication (id)');
        $this->addSql('ALTER TABLE tache_par_activite ADD CONSTRAINT FK_DD323A2D104FF23B FOREIGN KEY (executeur_id) REFERENCES utilisateur (id)');
        $this->addSql('ALTER TABLE tache_par_activite ADD CONSTRAINT FK_DD323A2DE57AEF2F FOREIGN KEY (validateur_id) REFERENCES utilisateur (id)');
        $this->addSql('ALTER TABLE utilisateur ADD CONSTRAINT FK_1D1C63B3D60322AC FOREIGN KEY (role_id) REFERENCES role (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE acces_par_defaut DROP FOREIGN KEY FK_65555A63D60322AC');
        $this->addSql('ALTER TABLE acces_par_defaut DROP FOREIGN KEY FK_65555A63CCD7E912');
        $this->addSql('ALTER TABLE acces_personnalise DROP FOREIGN KEY FK_E3B0A804FB88E14F');
        $this->addSql('ALTER TABLE acces_personnalise DROP FOREIGN KEY FK_E3B0A804CCD7E912');
        $this->addSql('ALTER TABLE acces_personnalise DROP FOREIGN KEY FK_E3B0A80457889920');
        $this->addSql('ALTER TABLE affaire DROP FOREIGN KEY FK_9C3F18EF19EB6921');
        $this->addSql('ALTER TABLE agenda DROP FOREIGN KEY FK_2CEDC87710335F61');
        $this->addSql('ALTER TABLE agenda DROP FOREIGN KEY FK_2CEDC877A4F84F6E');
        $this->addSql('ALTER TABLE chiffrage DROP FOREIGN KEY FK_C95FD4EAC54C8C93');
        $this->addSql('ALTER TABLE chiffrage DROP FOREIGN KEY FK_C95FD4EAF082E755');
        $this->addSql('ALTER TABLE chiffrage DROP FOREIGN KEY FK_C95FD4EA670C757F');
        $this->addSql('ALTER TABLE consigne DROP FOREIGN KEY FK_72406DA10335F61');
        $this->addSql('ALTER TABLE consigne DROP FOREIGN KEY FK_72406DAA4F84F6E');
        $this->addSql('ALTER TABLE fichiers DROP FOREIGN KEY FK_969DB4ABFB88E14F');
        $this->addSql('ALTER TABLE fichiers DROP FOREIGN KEY FK_969DB4AB92427262');
        $this->addSql('ALTER TABLE fichiers DROP FOREIGN KEY FK_969DB4AB3E30EEC1');
        $this->addSql('ALTER TABLE fichiers DROP FOREIGN KEY FK_969DB4AB98719779');
        $this->addSql('ALTER TABLE fichiers DROP FOREIGN KEY FK_969DB4AB77321B04');
        $this->addSql('ALTER TABLE fonction_sous_menu DROP FOREIGN KEY FK_E9484EEE5FBFC66');
        $this->addSql('ALTER TABLE message DROP FOREIGN KEY FK_B6BD307F10335F61');
        $this->addSql('ALTER TABLE message DROP FOREIGN KEY FK_B6BD307FA4F84F6E');
        $this->addSql('ALTER TABLE message_groupe DROP FOREIGN KEY FK_339E112EF520CF5A');
        $this->addSql('ALTER TABLE message_groupe DROP FOREIGN KEY FK_339E112E10335F61');
        $this->addSql('ALTER TABLE message_groupe DROP FOREIGN KEY FK_339E112ED60322AC');
        $this->addSql('ALTER TABLE message_groupe DROP FOREIGN KEY FK_339E112E9D1C3019');
        $this->addSql('ALTER TABLE ordre_fabrication DROP FOREIGN KEY FK_7FB222D2F082E755');
        $this->addSql('ALTER TABLE participants_groupe DROP FOREIGN KEY FK_C95ED3B39D1C3019');
        $this->addSql('ALTER TABLE participants_groupe DROP FOREIGN KEY FK_C95ED3B3FB88E14F');
        $this->addSql('ALTER TABLE sous_menu DROP FOREIGN KEY FK_F30864DFCCD7E912');
        $this->addSql('ALTER TABLE tache_par_activite DROP FOREIGN KEY FK_DD323A2DF7CF095C');
        $this->addSql('ALTER TABLE tache_par_activite DROP FOREIGN KEY FK_DD323A2D6A91B091');
        $this->addSql('ALTER TABLE tache_par_activite DROP FOREIGN KEY FK_DD323A2D104FF23B');
        $this->addSql('ALTER TABLE tache_par_activite DROP FOREIGN KEY FK_DD323A2DE57AEF2F');
        $this->addSql('ALTER TABLE utilisateur DROP FOREIGN KEY FK_1D1C63B3D60322AC');
        $this->addSql('DROP TABLE acces_par_defaut');
        $this->addSql('DROP TABLE acces_personnalise');
        $this->addSql('DROP TABLE affaire');
        $this->addSql('DROP TABLE agenda');
        $this->addSql('DROP TABLE chiffrage');
        $this->addSql('DROP TABLE client');
        $this->addSql('DROP TABLE consigne');
        $this->addSql('DROP TABLE fichiers');
        $this->addSql('DROP TABLE fonction');
        $this->addSql('DROP TABLE fonction_sous_menu');
        $this->addSql('DROP TABLE fournisseur');
        $this->addSql('DROP TABLE menu');
        $this->addSql('DROP TABLE message');
        $this->addSql('DROP TABLE message_groupe');
        $this->addSql('DROP TABLE objet');
        $this->addSql('DROP TABLE ordre_fabrication');
        $this->addSql('DROP TABLE participant');
        $this->addSql('DROP TABLE participants_groupe');
        $this->addSql('DROP TABLE piece_jointe');
        $this->addSql('DROP TABLE role');
        $this->addSql('DROP TABLE sous_menu');
        $this->addSql('DROP TABLE tache_facturable');
        $this->addSql('DROP TABLE tache_par_activite');
        $this->addSql('DROP TABLE type_chiffrage');
        $this->addSql('DROP TABLE utilisateur');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
