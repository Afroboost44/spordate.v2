
export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl text-gray-300">
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400 font-headline">
        Conditions Générales d'Utilisation (CGU)
      </h1>
      <div className="space-y-8 bg-card p-8 rounded-lg border border-border/20 shadow-lg shadow-accent/5">
        <p className="text-lg text-center text-gray-400">
          Bienvenue sur Spordate, une application de mise en relation sportive opérée et régie par le droit Suisse.
          <br />
          Date de dernière mise à jour : 29 Juillet 2024
        </p>

        <section>
          <h2 className="text-2xl font-bold text-cyan-400 mb-3 border-b border-cyan-900/50 pb-2">Article 1 : Objet</h2>
          <p className="text-gray-400">
            L'application Spordate a pour objet de faciliter la mise en relation entre des particuliers ("Utilisateurs") souhaitant pratiquer une activité sportive ensemble, et de permettre la réservation d'espaces ou de cours auprès d'établissements sportifs ("Partenaires"). Spordate agit en tant qu'intermédiaire technique.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-cyan-400 mb-3 border-b border-cyan-900/50 pb-2">Article 2 : Paiements & Politique d'Annulation</h2>
          <p className="text-gray-400 leading-relaxed">
            La réservation d'une activité via la plateforme est soumise à un paiement immédiat et sécurisé. Ce paiement confirme la réservation auprès du Partenaire.
            <br /><br />
            <strong>Règle d'annulation :</strong> L'Utilisateur a la possibilité d'annuler sa participation sans frais <strong className="text-yellow-400">jusqu'à une (1) heure avant le début prévu de l'activité.</strong> Passé ce délai, aucun remboursement, total ou partiel, ne sera possible. Le montant engagé sera intégralement conservé et reversé au Partenaire pour compenser la réservation de la place.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-cyan-400 mb-3 border-b border-cyan-900/50 pb-2">Article 3 : Responsabilité</h2>
          <p className="text-gray-400">
            Spordate agit en tant que simple intermédiaire. Notre responsabilité ne saurait être engagée en cas d'accident, de blessure ou de tout autre dommage survenant durant la pratique de l'activité sportive. La sécurité et l'assurance des participants relèvent de la responsabilité exclusive du Partenaire (club, salle de sport) et de l'assurance personnelle des Utilisateurs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-cyan-400 mb-3 border-b border-cyan-900/50 pb-2">Article 4 : Protection des Données</h2>
          <p className="text-gray-400">
            Nous nous engageons à protéger vos données personnelles conformément à la nouvelle Loi fédérale sur la protection des données (nLPD) en vigueur en Suisse. Vos informations ne sont utilisées que dans le cadre du fonctionnement de l'application et ne sont pas vendues à des tiers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-cyan-400 mb-3 border-b border-cyan-900/50 pb-2">Article 5 : For Juridique et Droit Applicable</h2>
          <p className="text-gray-400">
            Les présentes Conditions Générales d'Utilisation sont soumises au droit Suisse. En cas de litige, le for juridique exclusif est établi au siège de l'entreprise opérant Spordate, en Suisse.
          </p>
        </section>
      </div>
    </div>
  );
}
