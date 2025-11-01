// Classe utilitaire pour gérer la recherche, le filtrage et la pagination des produits
class APIFilters {
    constructor(query, queryStr) {
        // query = Requête MongoDB (ex: Product.find())
        // queryStr = Paramètres de requête venant du frontend (ex: req.query)
        this.query = query;
        this.queryStr = queryStr;
    }

    // 🔎 MÉTHODE 1 : Recherche par mot-clé
    search() {
        // Si un mot-clé est présent dans la query (ex: ?keyword=chaussure)
        const keyword = this.queryStr.keyword
            ? {
                name: {
                    // Utilise une expression régulière pour chercher dans le champ "name"
                    $regex: this.queryStr.keyword, // ex: "chaussure"
                    $options: "i" // "i" = insensible à la casse (majuscules/minuscules)
                }
            }
            : {}; // Si aucun mot-clé, on laisse un objet vide (pas de filtre)

        // Met à jour la requête MongoDB avec le filtre de recherche
        this.query = this.query.find({ ...keyword });

        // Retourne l’objet lui-même pour permettre le chaînage des méthodes (ex: .search().filters())
        return this;
    }

    // ⚙️ MÉTHODE 2 : Filtrage avancé (prix, catégories, etc.)
    filters() {
        // Copie les paramètres de la requête pour éviter de modifier l’original
        const queryCopy = { ...this.queryStr };

        // Liste des champs à exclure des filtres (car utilisés ailleurs)
        const fieldsToRemove = ["keyword", "page"];
        fieldsToRemove.forEach((el) => delete queryCopy[el]);

        // Convertit l’objet en chaîne JSON pour pouvoir manipuler les opérateurs
        let queryStr = JSON.stringify(queryCopy);

        // Remplace les opérateurs "gt", "gte", "lt", "lte" par leurs équivalents MongoDB : "$gt", "$gte", "$lt", "$lte"
        // Exemple : { "price[gte]": "100" } devient { "price": { "$gte": "100" } }
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

        // (Optionnel) Affiche la requête dans la console pour le debug
        console.log(queryStr);

        // Met à jour la requête MongoDB avec les filtres transformés
        this.query = this.query.find(JSON.parse(queryStr));

        // Retourne l’objet pour permettre le chaînage
        return this;
    }

    // 📄 MÉTHODE 3 : Pagination des résultats
    pagination(resPerPage) {
        // Récupère le numéro de page depuis la query string, ou 1 par défaut
        const currentPage = Number(this.queryStr.page) || 1;

        // Calcule le nombre de documents à "sauter" (skip) selon la page actuelle
        const skip = resPerPage * (currentPage - 1);

        // Met à jour la requête MongoDB pour limiter les résultats et ignorer les précédents
        this.query = this.query.limit(resPerPage).skip(skip);

        // Retourne l’objet pour chaînage
        return this;
    }
}

// Exporte la classe pour pouvoir l’utiliser ailleurs
export default APIFilters;


