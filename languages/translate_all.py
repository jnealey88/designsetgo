#!/usr/bin/env python3
"""
WordPress Plugin Translation Script for DesignSetGo
Translates all msgid strings in .po files to target languages
"""

import re
import os
from typing import Dict, List, Tuple

# Translation dictionaries for each language
# These are comprehensive translations maintaining WordPress terminology

TRANSLATIONS = {
    'es_ES': {
        # Plugin core
        'DesignSetGo': 'DesignSetGo',
        'Modern Gutenberg block library bridging the gap between core WordPress blocks and advanced page builders. Design made easy, fast, and beautiful.':
            'Biblioteca moderna de bloques Gutenberg que cierra la brecha entre los bloques principales de WordPress y los constructores de páginas avanzados. Diseño fácil, rápido y hermoso.',

        # Common UI terms
        'Information': 'Información',
        'Blocks': 'Bloques',
        'Settings': 'Ajustes',
        'Enable': 'Activar',
        'Disable': 'Desactivar',
        'Default': 'Predeterminado',
        'Custom': 'Personalizado',
        'None': 'Ninguno',
        'Auto': 'Automático',
        'Yes': 'Sí',
        'No': 'No',
        'Save': 'Guardar',
        'Cancel': 'Cancelar',
        'Delete': 'Eliminar',
        'Edit': 'Editar',
        'Add': 'Añadir',
        'Remove': 'Eliminar',
        'Insert': 'Insertar',
        'Update': 'Actualizar',
        'General': 'General',
        'Advanced': 'Avanzado',
        'Style': 'Estilo',
        'Styles': 'Estilos',
        'Layout': 'Diseño',
        'Content': 'Contenido',
        'Typography': 'Tipografía',
        'Color': 'Color',
        'Colors': 'Colores',
        'Background': 'Fondo',
        'Border': 'Borde',
        'Borders': 'Bordes',
        'Spacing': 'Espaciado',
        'Padding': 'Relleno',
        'Margin': 'Margen',
        'Width': 'Ancho',
        'Height': 'Alto',
        'Size': 'Tamaño',
        'Position': 'Posición',
        'Alignment': 'Alineación',
        'Direction': 'Dirección',
        'Orientation': 'Orientación',
        'Animation': 'Animación',
        'Animations': 'Animaciones',
        'Duration': 'Duración',
        'Delay': 'Retraso',
        'Easing': 'Suavizado',
        'Opacity': 'Opacidad',
        'Visibility': 'Visibilidad',
        'Display': 'Visualización',
        'Icon': 'Icono',
        'Icons': 'Iconos',
        'Image': 'Imagen',
        'Images': 'Imágenes',
        'Text': 'Texto',
        'Link': 'Enlace',
        'Links': 'Enlaces',
        'Button': 'Botón',
        'Buttons': 'Botones',
        'Label': 'Etiqueta',
        'Title': 'Título',
        'Description': 'Descripción',
        'Name': 'Nombre',
        'Value': 'Valor',
        'Type': 'Tipo',
        'Required': 'Obligatorio',
        'Optional': 'Opcional',
        'Placeholder': 'Marcador de posición',
        'Help': 'Ayuda',
        'Error': 'Error',
        'Success': 'Éxito',
        'Warning': 'Advertencia',
        'Message': 'Mensaje',
        'Submit': 'Enviar',
        'Reset': 'Restablecer',
        'Search': 'Buscar',
        'Filter': 'Filtrar',
        'Sort': 'Ordenar',
        'Show': 'Mostrar',
        'Hide': 'Ocultar',
        'Toggle': 'Alternar',
        'Open': 'Abrir',
        'Close': 'Cerrar',
        'Expand': 'Expandir',
        'Collapse': 'Contraer',
        'Select': 'Seleccionar',
        'Choose': 'Elegir',
        'Upload': 'Subir',
        'Download': 'Descargar',
        'Preview': 'Vista previa',
        'View': 'Ver',
        'Previous': 'Anterior',
        'Next': 'Siguiente',
        'Back': 'Atrás',
        'Forward': 'Adelante',
        'Top': 'Arriba',
        'Bottom': 'Abajo',
        'Left': 'Izquierda',
        'Right': 'Derecha',
        'Center': 'Centro',
        'Start': 'Inicio',
        'End': 'Fin',
        'Middle': 'Medio',
        'Full': 'Completo',
        'Half': 'Mitad',
        'Small': 'Pequeño',
        'Medium': 'Mediano',
        'Large': 'Grande',
        'Extra Large': 'Extra grande',
        'Horizontal': 'Horizontal',
        'Vertical': 'Vertical',
        'Row': 'Fila',
        'Column': 'Columna',
        'Columns': 'Columnas',
        'Grid': 'Cuadrícula',
        'Flex': 'Flex',
        'Stack': 'Pila',
        'Wrap': 'Envolver',
        'Nowrap': 'Sin envolver',
        'Stretch': 'Estirar',
        'Block': 'Bloque',
        'Inline': 'En línea',
        'Visible': 'Visible',
        'Hidden': 'Oculto',
        'Active': 'Activo',
        'Inactive': 'Inactivo',
        'Enabled': 'Activado',
        'Disabled': 'Desactivado',

        # Block names
        'Container': 'Contenedor',
        'Flex Container': 'Contenedor Flex',
        'Grid Container': 'Contenedor de cuadrícula',
        'Stack Container': 'Contenedor de pila',
        'Tab': 'Pestaña',
        'Tabs': 'Pestañas',
        'Accordion': 'Acordeón',
        'Accordion Item': 'Elemento de acordeón',
        'Counter': 'Contador',
        'Counter Group': 'Grupo de contadores',
        'Progress Bar': 'Barra de progreso',
        'Icon List': 'Lista de iconos',
        'Icon List Item': 'Elemento de lista de iconos',
        'Icon Button': 'Botón con icono',
        'Pill': 'Píldora',
        'Flip Card': 'Tarjeta giratoria',
        'Flip Card Front': 'Frente de tarjeta giratoria',
        'Flip Card Back': 'Reverso de tarjeta giratoria',
        'Reveal': 'Revelación',
        'Marquee': 'Marquesina',
        'Slider': 'Deslizador',
        'Slide': 'Diapositiva',
        'Form': 'Formulario',
        'Form Builder': 'Constructor de formularios',
        'Text Field': 'Campo de texto',
        'Email Field': 'Campo de correo electrónico',
        'Phone Field': 'Campo de teléfono',
        'Number Field': 'Campo numérico',
        'Date Field': 'Campo de fecha',
        'Textarea': 'Área de texto',
        'Select': 'Seleccionar',
        'Checkbox': 'Casilla de verificación',
        'Radio': 'Opción de radio',
        'File Upload': 'Subida de archivos',
        'Hidden Field': 'Campo oculto',

        # Form related
        'Form Settings': 'Ajustes del formulario',
        'Form submission': 'Envío del formulario',
        'Submit button text': 'Texto del botón de envío',
        'Success message': 'Mensaje de éxito',
        'Error message': 'Mensaje de error',
        'Validation': 'Validación',
        'Field is required': 'El campo es obligatorio',
        'Invalid email address': 'Dirección de correo electrónico no válida',
        'Invalid phone number': 'Número de teléfono no válido',
        'File too large': 'Archivo demasiado grande',
        'Invalid file type': 'Tipo de archivo no válido',
        'Minimum length': 'Longitud mínima',
        'Maximum length': 'Longitud máxima',
        'Minimum value': 'Valor mínimo',
        'Maximum value': 'Valor máximo',
        'Pattern': 'Patrón',
        'Accept': 'Aceptar',
        'Multiple files': 'Múltiples archivos',
        'Max file size': 'Tamaño máximo de archivo',
        'Allowed file types': 'Tipos de archivo permitidos',

        # Layout & spacing
        'Justify Content': 'Justificar contenido',
        'Align Items': 'Alinear elementos',
        'Gap': 'Espacio',
        'Column Gap': 'Espacio entre columnas',
        'Row Gap': 'Espacio entre filas',
        'Flex Direction': 'Dirección de Flex',
        'Flex Wrap': 'Envoltura de Flex',
        'Grid Template Columns': 'Columnas de plantilla de cuadrícula',
        'Grid Template Rows': 'Filas de plantilla de cuadrícula',
        'Auto': 'Automático',
        'Manual': 'Manual',
        'Responsive': 'Adaptable',
        'Desktop': 'Escritorio',
        'Tablet': 'Tableta',
        'Mobile': 'Móvil',
        'Breakpoint': 'Punto de quiebre',
        'Min Width': 'Ancho mínimo',
        'Max Width': 'Ancho máximo',
        'Min Height': 'Alto mínimo',
        'Max Height': 'Alto máximo',
        'Aspect Ratio': 'Relación de aspecto',
        'Object Fit': 'Ajuste de objeto',
        'Cover': 'Cubrir',
        'Contain': 'Contener',
        'Fill': 'Rellenar',
        'Scale Down': 'Reducir escala',

        # Animation
        'Fade In': 'Aparecer gradualmente',
        'Fade Out': 'Desvanecer',
        'Slide In': 'Deslizar hacia adentro',
        'Slide Out': 'Deslizar hacia afuera',
        'Zoom In': 'Acercar',
        'Zoom Out': 'Alejar',
        'Rotate': 'Rotar',
        'Scale': 'Escalar',
        'Linear': 'Lineal',
        'Ease': 'Suave',
        'Ease In': 'Suave al entrar',
        'Ease Out': 'Suave al salir',
        'Ease In Out': 'Suave al entrar y salir',
        'Spring': 'Resorte',
        'Bounce': 'Rebote',

        # Common phrases
        'No items found': 'No se encontraron elementos',
        'No results': 'Sin resultados',
        'Loading...': 'Cargando...',
        'Please wait': 'Por favor espere',
        'Are you sure?': '¿Está seguro?',
        'Confirm': 'Confirmar',
        'This action cannot be undone': 'Esta acción no se puede deshacer',
        'Changes saved': 'Cambios guardados',
        'Changes not saved': 'Cambios no guardados',
        'Something went wrong': 'Algo salió mal',
        'Try again': 'Intentar de nuevo',
        'Learn more': 'Más información',
        'Documentation': 'Documentación',
        'Support': 'Soporte',
        'Version': 'Versión',
        'Author': 'Autor',
        'License': 'Licencia',
        'Donate': 'Donar',
        'Rate': 'Calificar',
        'Share': 'Compartir',

        # Permissions & errors
        'Post not found.': 'Entrada no encontrada.',
        'You do not have permission to edit this post.': 'No tiene permiso para editar esta entrada.',
        'No matching blocks found to update.': 'No se encontraron bloques coincidentes para actualizar.',
        'Whether the operation was successful': 'Si la operación fue exitosa',
        'Post ID where blocks were updated': 'ID de entrada donde se actualizaron los bloques',
        'Number of blocks updated': 'Número de bloques actualizados',
        'Target post ID': 'ID de entrada objetivo',
        'Specific block client ID to update (optional)': 'ID de cliente de bloque específico para actualizar (opcional)',
        'Whether to update all matching blocks or just the first': 'Si actualizar todos los bloques coincidentes o solo el primero',

        # Abilities & registry
        'Abilities that provide information about blocks and capabilities': 'Capacidades que proporcionan información sobre bloques y funcionalidades',
        'Abilities for inserting and configuring blocks': 'Capacidades para insertar y configurar bloques',

        # Keep technical terms untranslated
        'Flexbox': 'Flexbox',
        'CSS': 'CSS',
        'HTML': 'HTML',
        'JavaScript': 'JavaScript',
        'JSON': 'JSON',
        'API': 'API',
        'URL': 'URL',
        'ID': 'ID',
        'px': 'px',
        'em': 'em',
        'rem': 'rem',
        '%': '%',
        'vh': 'vh',
        'vw': 'vw',
        'ms': 'ms',
        's': 's',
    },

    'fr_FR': {
        # Plugin core
        'DesignSetGo': 'DesignSetGo',
        'Modern Gutenberg block library bridging the gap between core WordPress blocks and advanced page builders. Design made easy, fast, and beautiful.':
            'Bibliothèque moderne de blocs Gutenberg comblant le fossé entre les blocs WordPress de base et les constructeurs de pages avancés. Conception facile, rapide et belle.',

        # Common UI terms
        'Information': 'Information',
        'Blocks': 'Blocs',
        'Settings': 'Réglages',
        'Enable': 'Activer',
        'Disable': 'Désactiver',
        'Default': 'Par défaut',
        'Custom': 'Personnalisé',
        'None': 'Aucun',
        'Auto': 'Automatique',
        'Yes': 'Oui',
        'No': 'Non',
        'Save': 'Enregistrer',
        'Cancel': 'Annuler',
        'Delete': 'Supprimer',
        'Edit': 'Modifier',
        'Add': 'Ajouter',
        'Remove': 'Retirer',
        'Insert': 'Insérer',
        'Update': 'Mettre à jour',
        'General': 'Général',
        'Advanced': 'Avancé',
        'Style': 'Style',
        'Styles': 'Styles',
        'Layout': 'Mise en page',
        'Content': 'Contenu',
        'Typography': 'Typographie',
        'Color': 'Couleur',
        'Colors': 'Couleurs',
        'Background': 'Arrière-plan',
        'Border': 'Bordure',
        'Borders': 'Bordures',
        'Spacing': 'Espacement',
        'Padding': 'Marge intérieure',
        'Margin': 'Marge extérieure',
        'Width': 'Largeur',
        'Height': 'Hauteur',
        'Size': 'Taille',
        'Position': 'Position',
        'Alignment': 'Alignement',
        'Direction': 'Direction',
        'Orientation': 'Orientation',
        'Animation': 'Animation',
        'Animations': 'Animations',
        'Duration': 'Durée',
        'Delay': 'Délai',
        'Easing': 'Lissage',
        'Opacity': 'Opacité',
        'Visibility': 'Visibilité',
        'Display': 'Affichage',
        'Icon': 'Icône',
        'Icons': 'Icônes',
        'Image': 'Image',
        'Images': 'Images',
        'Text': 'Texte',
        'Link': 'Lien',
        'Links': 'Liens',
        'Button': 'Bouton',
        'Buttons': 'Boutons',
        'Label': 'Étiquette',
        'Title': 'Titre',
        'Description': 'Description',
        'Name': 'Nom',
        'Value': 'Valeur',
        'Type': 'Type',
        'Required': 'Obligatoire',
        'Optional': 'Optionnel',
        'Placeholder': 'Espace réservé',
        'Help': 'Aide',
        'Error': 'Erreur',
        'Success': 'Succès',
        'Warning': 'Avertissement',
        'Message': 'Message',
        'Submit': 'Envoyer',
        'Reset': 'Réinitialiser',
        'Search': 'Rechercher',
        'Filter': 'Filtrer',
        'Sort': 'Trier',
        'Show': 'Afficher',
        'Hide': 'Masquer',
        'Toggle': 'Basculer',
        'Open': 'Ouvrir',
        'Close': 'Fermer',
        'Expand': 'Développer',
        'Collapse': 'Réduire',
        'Select': 'Sélectionner',
        'Choose': 'Choisir',
        'Upload': 'Téléverser',
        'Download': 'Télécharger',
        'Preview': 'Aperçu',
        'View': 'Voir',
        'Previous': 'Précédent',
        'Next': 'Suivant',
        'Back': 'Retour',
        'Forward': 'Avant',
        'Top': 'Haut',
        'Bottom': 'Bas',
        'Left': 'Gauche',
        'Right': 'Droite',
        'Center': 'Centre',
        'Start': 'Début',
        'End': 'Fin',
        'Middle': 'Milieu',
        'Full': 'Complet',
        'Half': 'Moitié',
        'Small': 'Petit',
        'Medium': 'Moyen',
        'Large': 'Grand',
        'Extra Large': 'Très grand',
        'Horizontal': 'Horizontal',
        'Vertical': 'Vertical',
        'Row': 'Ligne',
        'Column': 'Colonne',
        'Columns': 'Colonnes',
        'Grid': 'Grille',
        'Flex': 'Flex',
        'Stack': 'Pile',
        'Wrap': 'Retour à la ligne',
        'Nowrap': 'Sans retour',
        'Stretch': 'Étirer',
        'Block': 'Bloc',
        'Inline': 'En ligne',
        'Visible': 'Visible',
        'Hidden': 'Masqué',
        'Active': 'Actif',
        'Inactive': 'Inactif',
        'Enabled': 'Activé',
        'Disabled': 'Désactivé',

        # Block names
        'Container': 'Conteneur',
        'Flex Container': 'Conteneur Flex',
        'Grid Container': 'Conteneur de grille',
        'Stack Container': 'Conteneur de pile',
        'Tab': 'Onglet',
        'Tabs': 'Onglets',
        'Accordion': 'Accordéon',
        'Accordion Item': 'Élément d\'accordéon',
        'Counter': 'Compteur',
        'Counter Group': 'Groupe de compteurs',
        'Progress Bar': 'Barre de progression',
        'Icon List': 'Liste d\'icônes',
        'Icon List Item': 'Élément de liste d\'icônes',
        'Icon Button': 'Bouton avec icône',
        'Pill': 'Pilule',
        'Flip Card': 'Carte à retourner',
        'Flip Card Front': 'Face avant de la carte',
        'Flip Card Back': 'Face arrière de la carte',
        'Reveal': 'Révélation',
        'Marquee': 'Défilement',
        'Slider': 'Curseur',
        'Slide': 'Diapositive',
        'Form': 'Formulaire',
        'Form Builder': 'Constructeur de formulaires',
        'Text Field': 'Champ de texte',
        'Email Field': 'Champ e-mail',
        'Phone Field': 'Champ téléphone',
        'Number Field': 'Champ numérique',
        'Date Field': 'Champ de date',
        'Textarea': 'Zone de texte',
        'Select': 'Sélection',
        'Checkbox': 'Case à cocher',
        'Radio': 'Bouton radio',
        'File Upload': 'Téléversement de fichier',
        'Hidden Field': 'Champ masqué',

        # Form related
        'Form Settings': 'Paramètres du formulaire',
        'Form submission': 'Soumission du formulaire',
        'Submit button text': 'Texte du bouton d\'envoi',
        'Success message': 'Message de succès',
        'Error message': 'Message d\'erreur',
        'Validation': 'Validation',
        'Field is required': 'Le champ est obligatoire',
        'Invalid email address': 'Adresse e-mail non valide',
        'Invalid phone number': 'Numéro de téléphone non valide',
        'File too large': 'Fichier trop volumineux',
        'Invalid file type': 'Type de fichier non valide',
        'Minimum length': 'Longueur minimale',
        'Maximum length': 'Longueur maximale',
        'Minimum value': 'Valeur minimale',
        'Maximum value': 'Valeur maximale',
        'Pattern': 'Modèle',
        'Accept': 'Accepter',
        'Multiple files': 'Fichiers multiples',
        'Max file size': 'Taille maximale du fichier',
        'Allowed file types': 'Types de fichiers autorisés',

        # Layout & spacing
        'Justify Content': 'Justifier le contenu',
        'Align Items': 'Aligner les éléments',
        'Gap': 'Espacement',
        'Column Gap': 'Espacement des colonnes',
        'Row Gap': 'Espacement des lignes',
        'Flex Direction': 'Direction Flex',
        'Flex Wrap': 'Retour Flex',
        'Grid Template Columns': 'Colonnes du modèle de grille',
        'Grid Template Rows': 'Lignes du modèle de grille',
        'Manual': 'Manuel',
        'Responsive': 'Adaptatif',
        'Desktop': 'Bureau',
        'Tablet': 'Tablette',
        'Mobile': 'Mobile',
        'Breakpoint': 'Point de rupture',
        'Min Width': 'Largeur minimale',
        'Max Width': 'Largeur maximale',
        'Min Height': 'Hauteur minimale',
        'Max Height': 'Hauteur maximale',
        'Aspect Ratio': 'Rapport d\'aspect',
        'Object Fit': 'Ajustement d\'objet',
        'Cover': 'Couvrir',
        'Contain': 'Contenir',
        'Fill': 'Remplir',
        'Scale Down': 'Réduire l\'échelle',

        # Animation
        'Fade In': 'Apparition en fondu',
        'Fade Out': 'Disparition en fondu',
        'Slide In': 'Glisser vers l\'intérieur',
        'Slide Out': 'Glisser vers l\'extérieur',
        'Zoom In': 'Zoom avant',
        'Zoom Out': 'Zoom arrière',
        'Rotate': 'Rotation',
        'Scale': 'Échelle',
        'Linear': 'Linéaire',
        'Ease': 'Lissé',
        'Ease In': 'Lissé à l\'entrée',
        'Ease Out': 'Lissé à la sortie',
        'Ease In Out': 'Lissé à l\'entrée et sortie',
        'Spring': 'Ressort',
        'Bounce': 'Rebond',

        # Common phrases
        'No items found': 'Aucun élément trouvé',
        'No results': 'Aucun résultat',
        'Loading...': 'Chargement...',
        'Please wait': 'Veuillez patienter',
        'Are you sure?': 'Êtes-vous sûr ?',
        'Confirm': 'Confirmer',
        'This action cannot be undone': 'Cette action ne peut pas être annulée',
        'Changes saved': 'Modifications enregistrées',
        'Changes not saved': 'Modifications non enregistrées',
        'Something went wrong': 'Quelque chose s\'est mal passé',
        'Try again': 'Réessayer',
        'Learn more': 'En savoir plus',
        'Documentation': 'Documentation',
        'Support': 'Support',
        'Version': 'Version',
        'Author': 'Auteur',
        'License': 'Licence',
        'Donate': 'Faire un don',
        'Rate': 'Évaluer',
        'Share': 'Partager',

        # Permissions & errors
        'Post not found.': 'Article non trouvé.',
        'You do not have permission to edit this post.': 'Vous n\'avez pas la permission de modifier cet article.',
        'No matching blocks found to update.': 'Aucun bloc correspondant trouvé pour la mise à jour.',
        'Whether the operation was successful': 'Si l\'opération a réussi',
        'Post ID where blocks were updated': 'ID de l\'article où les blocs ont été mis à jour',
        'Number of blocks updated': 'Nombre de blocs mis à jour',
        'Target post ID': 'ID de l\'article cible',
        'Specific block client ID to update (optional)': 'ID client du bloc spécifique à mettre à jour (optionnel)',
        'Whether to update all matching blocks or just the first': 'Mettre à jour tous les blocs correspondants ou seulement le premier',

        # Abilities & registry
        'Abilities that provide information about blocks and capabilities': 'Capacités fournissant des informations sur les blocs et fonctionnalités',
        'Abilities for inserting and configuring blocks': 'Capacités pour insérer et configurer les blocs',
    },
}

def read_po_file(filepath: str) -> List[Tuple[str, str, int]]:
    """
    Read a .po file and extract msgid entries with empty msgstr.
    Returns list of tuples: (msgid, context, line_number)
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    entries = []
    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Skip comments and empty lines
        if line.startswith('#') or not line:
            i += 1
            continue

        # Look for msgid
        if line.startswith('msgid "'):
            msgid_line = i
            msgid = line[7:-1]  # Extract string between "msgid "" and """

            # Handle multiline msgid
            i += 1
            while i < len(lines) and lines[i].strip().startswith('"'):
                msgid += lines[i].strip()[1:-1]
                i += 1

            # Check if next line is msgstr ""
            if i < len(lines) and lines[i].strip() == 'msgstr ""':
                if msgid:  # Skip empty msgid (header)
                    entries.append((msgid, '', msgid_line))
                i += 1
            else:
                i += 1
        else:
            i += 1

    return entries

def translate_string(msgid: str, lang_code: str) -> str:
    """
    Translate a msgid string to the target language.
    Returns the translation or the original if not found.
    """
    translations = TRANSLATIONS.get(lang_code, {})

    # Direct match
    if msgid in translations:
        return translations[msgid]

    # For now, return msgid for strings not in dictionary
    # The script will need to be run multiple times with growing dictionaries
    return msgid

def update_po_file(filepath: str, lang_code: str):
    """
    Update a .po file with translations.
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into lines for processing
    lines = content.split('\n')
    updated_lines = []
    i = 0

    while i < len(lines):
        line = lines[i]
        updated_lines.append(line)

        # Look for msgid followed by empty msgstr
        if line.strip().startswith('msgid "') and line.strip() != 'msgid ""':
            # Extract msgid
            msgid = line.strip()[7:-1]

            # Handle multiline msgid
            j = i + 1
            while j < len(lines) and lines[j].strip().startswith('"') and not lines[j].strip().startswith('msgstr'):
                msgid += lines[j].strip()[1:-1]
                updated_lines.append(lines[j])
                j += 1

            # Check if next line is msgstr ""
            if j < len(lines) and lines[j].strip() == 'msgstr ""':
                # Get translation
                translation = translate_string(msgid, lang_code)

                if translation and translation != msgid:
                    # Replace empty msgstr with translation
                    updated_lines.append(f'msgstr "{translation}"')
                else:
                    # Keep empty msgstr
                    updated_lines.append(lines[j])

                i = j + 1
                continue

        i += 1

    # Write updated content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(updated_lines))

# Test with a small subset first
if __name__ == '__main__':
    lang_file = '/Users/jnealey/Documents/GitHub/designsetgo/languages/designsetgo-es_ES.po'
    print(f"Reading {lang_file}...")
    entries = read_po_file(lang_file)
    print(f"Found {len(entries)} empty msgstr entries")
    print(f"\nFirst 10 entries:")
    for i, (msgid, context, line) in enumerate(entries[:10], 1):
        print(f"{i}. Line {line}: {msgid[:60]}...")
