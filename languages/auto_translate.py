#!/usr/bin/env python3
"""
Automated WordPress Plugin Translation Script for DesignSetGo
Translates all msgid strings in .po files using comprehensive translation mappings
"""

import re
import os
from typing import Dict

# Translation function that provides translations for each target language
def translate_text(text: str, target_lang: str) -> str:
    """
    Translate text to target language using comprehensive mappings.
    Returns original text if no translation is found.
    """

    # Define translations for all languages
    # Each language code maps to a dictionary of English -> Translated text

    TRANSLATIONS = {
        'es_ES': {  # Spanish
            # Technical terms - keep English
            'DesignSetGo': 'DesignSetGo',
            'Flexbox': 'Flexbox',
            'CSS': 'CSS',
            'HTML': 'HTML',
            'JavaScript': 'JavaScript',
            'JSON': 'JSON',
            'API': 'API',
            'AJAX': 'AJAX',
            'URL': 'URL',
            'ID': 'ID',
            'ARIA': 'ARIA',

            # URLs - keep as is
            'https://designsetgoblocks.com': 'https://designsetgoblocks.com',

            # Plugin description
            'Modern Gutenberg block library bridging the gap between core WordPress blocks and advanced page builders. Design made easy, fast, and beautiful.':
                'Biblioteca moderna de bloques Gutenberg que cierra la brecha entre los bloques principales de WordPress y los constructores de páginas avanzados. Diseño fácil, rápido y hermoso.',

            # Common WordPress/UI terms
            'Information': 'Información',
            'Blocks': 'Bloques',
            'Block': 'Bloque',
            'Settings': 'Ajustes',
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
            'Visible': 'Visible',
            'Hidden': 'Oculto',
            'Active': 'Activo',
            'Inactive': 'Inactivo',
            'Enabled': 'Activado',
            'Disabled': 'Desactivado',
            'Enable': 'Activar',
            'Disable': 'Desactivar',
            'Add': 'Añadir',
            'Remove': 'Eliminar',
            'Delete': 'Borrar',
            'Edit': 'Editar',
            'Save': 'Guardar',
            'Cancel': 'Cancelar',
            'Update': 'Actualizar',
            'Insert': 'Insertar',
            'Copy': 'Copiar',
            'Paste': 'Pegar',
            'Duplicate': 'Duplicar',
            'Clear': 'Limpiar',
            'Apply': 'Aplicar',
            'Confirm': 'Confirmar',
            'Yes': 'Sí',
            'No': 'No',
            'True': 'Verdadero',
            'False': 'Falso',
            'None': 'Ninguno',
            'Auto': 'Automático',
            'Manual': 'Manual',
            'Custom': 'Personalizado',
            'Default': 'Predeterminado',
            'Options': 'Opciones',
            'Basic': 'Básico',

            # Actions & States
            'Loading...': 'Cargando...',
            'Processing...': 'Procesando...',
            'Saving...': 'Guardando...',
            'Loading': 'Cargando',
            'Processing': 'Procesando',
            'Saving': 'Guardando',
            'Saved': 'Guardado',
            'Complete': 'Completado',
            'Pending': 'Pendiente',
            'Failed': 'Fallido',
            'Please wait': 'Por favor espere',
            'Are you sure?': '¿Está seguro?',
            'Try again': 'Intentar de nuevo',

            # Block names
            'Container': 'Contenedor',
            'Flex Container': 'Contenedor Flex',
            'Grid Container': 'Contenedor de cuadrícula',
            'Stack Container': 'Contenedor de pila',
            'Tab': 'Pestaña',
            'Tabs': 'Pestañas',
            'Accordion': 'Acordeón',
            'Accordion Item': 'Elemento de acordeón',
            'Scroll Accordion': 'Acordeón con desplazamiento',
            'Scroll Accordion Item': 'Elemento de acordeón con desplazamiento',
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
            'Scroll Marquee': 'Marquesina con desplazamiento',
            'Slider': 'Deslizador',
            'Slide': 'Diapositiva',
            'Image Accordion': 'Acordeón de imágenes',
            'Image Accordion Item': 'Elemento de acordeón de imágenes',
            'Blobs': 'Manchas',

            # Form blocks
            'Form': 'Formulario',
            'Form Builder': 'Constructor de formularios',
            'Text Field': 'Campo de texto',
            'Email Field': 'Campo de correo electrónico',
            'Phone Field': 'Campo de teléfono',
            'Number Field': 'Campo numérico',
            'URL Field': 'Campo de URL',
            'Date Field': 'Campo de fecha',
            'Time Field': 'Campo de hora',
            'Textarea': 'Área de texto',
            'Checkbox': 'Casilla de verificación',
            'Radio': 'Opción de radio',
            'Radio Group': 'Grupo de opciones de radio',
            'File Upload': 'Subida de archivos',
            'Hidden Field': 'Campo oculto',
            'Field': 'Campo',
            'Fields': 'Campos',

            # Form settings
            'Form Settings': 'Ajustes del formulario',
            'Form submission': 'Envío del formulario',
            'Submit button text': 'Texto del botón de envío',
            'Success message': 'Mensaje de éxito',
            'Error message': 'Mensaje de error',
            'Validation': 'Validación',
            'Field is required': 'El campo es obligatorio',
            'This field is required': 'Este campo es obligatorio',
            'Invalid email address': 'Dirección de correo electrónico no válida',
            'Invalid phone number': 'Número de teléfono no válido',
            'Invalid URL': 'URL no válida',
            'Invalid date': 'Fecha no válida',
            'Invalid time': 'Hora no válida',
            'Invalid number': 'Número no válido',
            'File too large': 'Archivo demasiado grande',
            'Invalid file type': 'Tipo de archivo no válido',
            'Minimum length': 'Longitud mínima',
            'Maximum length': 'Longitud máxima',
            'Minimum value': 'Valor mínimo',
            'Maximum value': 'Valor máximo',
            'Pattern': 'Patrón',
            'Multiple files': 'Múltiples archivos',
            'Max file size': 'Tamaño máximo de archivo',
            'Allowed file types': 'Tipos de archivo permitidos',
            'Accept': 'Aceptar',
            'Default Value': 'Valor predeterminado',
            'Autocomplete': 'Autocompletar',
            'Read Only': 'Solo lectura',
            'Multiple': 'Múltiple',

            # Layout & Grid
            'Justify Content': 'Justificar contenido',
            'Align Items': 'Alinear elementos',
            'Gap': 'Espacio',
            'Column Gap': 'Espacio entre columnas',
            'Row Gap': 'Espacio entre filas',
            'Flex Direction': 'Dirección de Flex',
            'Flex Wrap': 'Envoltura de Flex',
            'Grid Template Columns': 'Columnas de plantilla de cuadrícula',
            'Grid Template Rows': 'Filas de plantilla de cuadrícula',
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
            'Animate': 'Animar',
            'Transition': 'Transición',
            'Transform': 'Transformar',
            'Rotate': 'Rotar',
            'Scale': 'Escalar',
            'Translate': 'Trasladar',
            'Fade': 'Desvanecer',
            'Zoom': 'Zoom',
            'Fade In': 'Aparecer gradualmente',
            'Fade Out': 'Desvanecer',
            'Slide In': 'Deslizar hacia adentro',
            'Slide Out': 'Deslizar hacia afuera',
            'Zoom In': 'Acercar',
            'Zoom Out': 'Alejar',
            'Linear': 'Lineal',
            'Ease': 'Suave',
            'Ease In': 'Suave al entrar',
            'Ease Out': 'Suave al salir',
            'Ease In Out': 'Suave al entrar y salir',
            'Spring': 'Resorte',
            'Bounce': 'Rebote',

            # Responsive
            'Responsive': 'Adaptable',
            'Breakpoint': 'Punto de quiebre',
            'Breakpoints': 'Puntos de quiebre',
            'Desktop': 'Escritorio',
            'Tablet': 'Tableta',
            'Mobile': 'Móvil',
            'Phone': 'Teléfono',
            'Screen': 'Pantalla',
            'Device': 'Dispositivo',

            # Media
            'Media': 'Medios',
            'Video': 'Vídeo',
            'Audio': 'Audio',
            'Gallery': 'Galería',
            'Thumbnail': 'Miniatura',
            'Full Size': 'Tamaño completo',
            'Image Width': 'Ancho de imagen',
            'Image Height': 'Alto de imagen',

            # Common sizes
            'Extra Small': 'Extra pequeño',
            'Extra Large': 'Extra grande',
            'Third': 'Tercio',
            'Quarter': 'Cuarto',

            # Messages
            'No items found': 'No se encontraron elementos',
            'No results': 'Sin resultados',
            'No submissions found': 'No se encontraron envíos',
            'This action cannot be undone': 'Esta acción no se puede deshacer',
            'Changes saved': 'Cambios guardados',
            'Changes not saved': 'Cambios no guardados',
            'Something went wrong': 'Algo salió mal',
            'Learn more': 'Más información',
            'Read more': 'Leer más',
            'Show more': 'Mostrar más',
            'Show less': 'Mostrar menos',

            # Documentation
            'Documentation': 'Documentación',
            'Support': 'Soporte',
            'Tutorial': 'Tutorial',
            'Guide': 'Guía',
            'Examples': 'Ejemplos',
            'Demo': 'Demostración',

            # Meta
            'Version': 'Versión',
            'Author': 'Autor',
            'License': 'Licencia',
            'Plugin': 'Plugin',
            'Theme': 'Tema',
            'Widget': 'Widget',
            'Extension': 'Extensión',

            # Permissions & Errors
            'Post not found.': 'Entrada no encontrada.',
            'Page not found.': 'Página no encontrada.',
            'You do not have permission to edit this post.': 'No tiene permiso para editar esta entrada.',
            'No matching blocks found to update.': 'No se encontraron bloques coincidentes para actualizar.',
            'Whether the operation was successful': 'Si la operación fue exitosa',
            'Post ID where blocks were updated': 'ID de entrada donde se actualizaron los bloques',
            'Number of blocks updated': 'Número de bloques actualizados',
            'Target post ID': 'ID de entrada objetivo',

            # Abilities
            'Abilities that provide information about blocks and capabilities':
                'Capacidades que proporcionan información sobre bloques y funcionalidades',
            'Abilities for inserting and configuring blocks':
                'Capacidades para insertar y configurar bloques',

            # Technical/API terms
            'Accessibility': 'Accesibilidad',
            'Screen Reader': 'Lector de pantalla',
            'Alt Text': 'Texto alternativo',
            'Count': 'Cuenta',
            'Start Value': 'Valor inicial',
            'End Value': 'Valor final',
            'Increment': 'Incremento',
            'Progress': 'Progreso',
            'Percentage': 'Porcentaje',
            'Bar Color': 'Color de barra',
            'Track Color': 'Color de pista',

            # Common phrases with context
            'Previous slide': 'Diapositiva anterior',
            'Next slide': 'Siguiente diapositiva',
            'Tab alignment': 'Alineación de pestañas',
            'Animation easing function': 'Función de suavizado de animación',
            'Maximum characters allowed (0 = no limit)': 'Máximo de caracteres permitidos (0 = sin límite)',

            # Special
            'show': 'mostrar',
            '(empty)': '(vacío)',
        },

        'fr_FR': {  # French
            # Technical terms - keep English
            'DesignSetGo': 'DesignSetGo',
            'Flexbox': 'Flexbox',
            'CSS': 'CSS',
            'HTML': 'HTML',
            'JavaScript': 'JavaScript',
            'JSON': 'JSON',
            'API': 'API',
            'AJAX': 'AJAX',
            'URL': 'URL',
            'ID': 'ID',
            'ARIA': 'ARIA',

            # URLs - keep as is
            'https://designsetgoblocks.com': 'https://designsetgoblocks.com',

            # Plugin description
            'Modern Gutenberg block library bridging the gap between core WordPress blocks and advanced page builders. Design made easy, fast, and beautiful.':
                'Bibliothèque moderne de blocs Gutenberg comblant le fossé entre les blocs WordPress de base et les constructeurs de pages avancés. Conception facile, rapide et belle.',

            # Common WordPress/UI terms
            'Information': 'Information',
            'Blocks': 'Blocs',
            'Block': 'Bloc',
            'Settings': 'Réglages',
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
            'Visible': 'Visible',
            'Hidden': 'Masqué',
            'Active': 'Actif',
            'Inactive': 'Inactif',
            'Enabled': 'Activé',
            'Disabled': 'Désactivé',
            'Enable': 'Activer',
            'Disable': 'Désactiver',
            'Add': 'Ajouter',
            'Remove': 'Retirer',
            'Delete': 'Supprimer',
            'Edit': 'Modifier',
            'Save': 'Enregistrer',
            'Cancel': 'Annuler',
            'Update': 'Mettre à jour',
            'Insert': 'Insérer',
            'Copy': 'Copier',
            'Paste': 'Coller',
            'Duplicate': 'Dupliquer',
            'Clear': 'Effacer',
            'Apply': 'Appliquer',
            'Confirm': 'Confirmer',
            'Yes': 'Oui',
            'No': 'Non',
            'True': 'Vrai',
            'False': 'Faux',
            'None': 'Aucun',
            'Auto': 'Automatique',
            'Manual': 'Manuel',
            'Custom': 'Personnalisé',
            'Default': 'Par défaut',
            'Options': 'Options',
            'Basic': 'Basique',

            # Actions & States
            'Loading...': 'Chargement...',
            'Processing...': 'Traitement...',
            'Saving...': 'Enregistrement...',
            'Loading': 'Chargement',
            'Processing': 'Traitement',
            'Saving': 'Enregistrement',
            'Saved': 'Enregistré',
            'Complete': 'Terminé',
            'Pending': 'En attente',
            'Failed': 'Échoué',
            'Please wait': 'Veuillez patienter',
            'Are you sure?': 'Êtes-vous sûr ?',
            'Try again': 'Réessayer',

            # Block names
            'Container': 'Conteneur',
            'Flex Container': 'Conteneur Flex',
            'Grid Container': 'Conteneur de grille',
            'Stack Container': 'Conteneur de pile',
            'Tab': 'Onglet',
            'Tabs': 'Onglets',
            'Accordion': 'Accordéon',
            'Accordion Item': 'Élément d\'accordéon',
            'Scroll Accordion': 'Accordéon défilant',
            'Scroll Accordion Item': 'Élément d\'accordéon défilant',
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
            'Scroll Marquee': 'Défilement de marquise',
            'Slider': 'Curseur',
            'Slide': 'Diapositive',
            'Image Accordion': 'Accordéon d\'images',
            'Image Accordion Item': 'Élément d\'accordéon d\'images',
            'Blobs': 'Taches',

            # Form blocks
            'Form': 'Formulaire',
            'Form Builder': 'Constructeur de formulaires',
            'Text Field': 'Champ de texte',
            'Email Field': 'Champ e-mail',
            'Phone Field': 'Champ téléphone',
            'Number Field': 'Champ numérique',
            'URL Field': 'Champ URL',
            'Date Field': 'Champ de date',
            'Time Field': 'Champ d\'heure',
            'Textarea': 'Zone de texte',
            'Checkbox': 'Case à cocher',
            'Radio': 'Bouton radio',
            'Radio Group': 'Groupe de boutons radio',
            'File Upload': 'Téléversement de fichier',
            'Hidden Field': 'Champ masqué',
            'Field': 'Champ',
            'Fields': 'Champs',

            # Form settings
            'Form Settings': 'Paramètres du formulaire',
            'Form submission': 'Soumission du formulaire',
            'Submit button text': 'Texte du bouton d\'envoi',
            'Success message': 'Message de succès',
            'Error message': 'Message d\'erreur',
            'Validation': 'Validation',
            'Field is required': 'Le champ est obligatoire',
            'This field is required': 'Ce champ est obligatoire',
            'Invalid email address': 'Adresse e-mail non valide',
            'Invalid phone number': 'Numéro de téléphone non valide',
            'Invalid URL': 'URL non valide',
            'Invalid date': 'Date non valide',
            'Invalid time': 'Heure non valide',
            'Invalid number': 'Nombre non valide',
            'File too large': 'Fichier trop volumineux',
            'Invalid file type': 'Type de fichier non valide',
            'Minimum length': 'Longueur minimale',
            'Maximum length': 'Longueur maximale',
            'Minimum value': 'Valeur minimale',
            'Maximum value': 'Valeur maximale',
            'Pattern': 'Modèle',
            'Multiple files': 'Fichiers multiples',
            'Max file size': 'Taille maximale du fichier',
            'Allowed file types': 'Types de fichiers autorisés',
            'Accept': 'Accepter',
            'Default Value': 'Valeur par défaut',
            'Autocomplete': 'Saisie automatique',
            'Read Only': 'Lecture seule',
            'Multiple': 'Multiple',

            # Layout & Grid
            'Justify Content': 'Justifier le contenu',
            'Align Items': 'Aligner les éléments',
            'Gap': 'Espacement',
            'Column Gap': 'Espacement des colonnes',
            'Row Gap': 'Espacement des lignes',
            'Flex Direction': 'Direction Flex',
            'Flex Wrap': 'Retour Flex',
            'Grid Template Columns': 'Colonnes du modèle de grille',
            'Grid Template Rows': 'Lignes du modèle de grille',
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
            'Animate': 'Animer',
            'Transition': 'Transition',
            'Transform': 'Transformation',
            'Rotate': 'Rotation',
            'Scale': 'Échelle',
            'Translate': 'Translation',
            'Fade': 'Fondu',
            'Zoom': 'Zoom',
            'Fade In': 'Apparition en fondu',
            'Fade Out': 'Disparition en fondu',
            'Slide In': 'Glisser vers l\'intérieur',
            'Slide Out': 'Glisser vers l\'extérieur',
            'Zoom In': 'Zoom avant',
            'Zoom Out': 'Zoom arrière',
            'Linear': 'Linéaire',
            'Ease': 'Lissé',
            'Ease In': 'Lissé à l\'entrée',
            'Ease Out': 'Lissé à la sortie',
            'Ease In Out': 'Lissé à l\'entrée et sortie',
            'Spring': 'Ressort',
            'Bounce': 'Rebond',

            # Responsive
            'Responsive': 'Adaptatif',
            'Breakpoint': 'Point de rupture',
            'Breakpoints': 'Points de rupture',
            'Desktop': 'Bureau',
            'Tablet': 'Tablette',
            'Mobile': 'Mobile',
            'Phone': 'Téléphone',
            'Screen': 'Écran',
            'Device': 'Appareil',

            # Media
            'Media': 'Médias',
            'Video': 'Vidéo',
            'Audio': 'Audio',
            'Gallery': 'Galerie',
            'Thumbnail': 'Miniature',
            'Full Size': 'Taille complète',
            'Image Width': 'Largeur de l\'image',
            'Image Height': 'Hauteur de l\'image',

            # Common sizes
            'Extra Small': 'Très petit',
            'Extra Large': 'Très grand',
            'Third': 'Tiers',
            'Quarter': 'Quart',

            # Messages
            'No items found': 'Aucun élément trouvé',
            'No results': 'Aucun résultat',
            'No submissions found': 'Aucune soumission trouvée',
            'This action cannot be undone': 'Cette action ne peut pas être annulée',
            'Changes saved': 'Modifications enregistrées',
            'Changes not saved': 'Modifications non enregistrées',
            'Something went wrong': 'Quelque chose s\'est mal passé',
            'Learn more': 'En savoir plus',
            'Read more': 'Lire la suite',
            'Show more': 'Afficher plus',
            'Show less': 'Afficher moins',

            # Documentation
            'Documentation': 'Documentation',
            'Support': 'Support',
            'Tutorial': 'Tutoriel',
            'Guide': 'Guide',
            'Examples': 'Exemples',
            'Demo': 'Démonstration',

            # Meta
            'Version': 'Version',
            'Author': 'Auteur',
            'License': 'Licence',
            'Plugin': 'Extension',
            'Theme': 'Thème',
            'Widget': 'Widget',
            'Extension': 'Extension',

            # Permissions & Errors
            'Post not found.': 'Article non trouvé.',
            'Page not found.': 'Page non trouvée.',
            'You do not have permission to edit this post.': 'Vous n\'avez pas la permission de modifier cet article.',
            'No matching blocks found to update.': 'Aucun bloc correspondant trouvé pour la mise à jour.',
            'Whether the operation was successful': 'Si l\'opération a réussi',
            'Post ID where blocks were updated': 'ID de l\'article où les blocs ont été mis à jour',
            'Number of blocks updated': 'Nombre de blocs mis à jour',
            'Target post ID': 'ID de l\'article cible',

            # Abilities
            'Abilities that provide information about blocks and capabilities':
                'Capacités fournissant des informations sur les blocs et fonctionnalités',
            'Abilities for inserting and configuring blocks':
                'Capacités pour insérer et configurer les blocs',

            # Technical/API terms
            'Accessibility': 'Accessibilité',
            'Screen Reader': 'Lecteur d\'écran',
            'Alt Text': 'Texte alternatif',
            'Count': 'Compte',
            'Start Value': 'Valeur de départ',
            'End Value': 'Valeur finale',
            'Increment': 'Incrément',
            'Progress': 'Progression',
            'Percentage': 'Pourcentage',
            'Bar Color': 'Couleur de la barre',
            'Track Color': 'Couleur de la piste',

            # Common phrases with context
            'Previous slide': 'Diapositive précédente',
            'Next slide': 'Diapositive suivante',
            'Tab alignment': 'Alignement des onglets',
            'Animation easing function': 'Fonction de lissage d\'animation',
            'Maximum characters allowed (0 = no limit)': 'Caractères maximums autorisés (0 = aucune limite)',

            # Special
            'show': 'afficher',
            '(empty)': '(vide)',
        },
    }

    # Get the translation dictionary for the target language
    lang_dict = TRANSLATIONS.get(target_lang, {})

    # Return the translation if found, otherwise return original
    return lang_dict.get(text, text)


def update_po_file_with_translations(filepath: str, lang_code: str):
    """
    Read a PO file, translate all empty msgstr entries, and write back.
    Returns tuple of (translated_count, skipped_count)
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    translated_count = 0
    skipped_count = 0

    i = 0
    while i < len(lines):
        line = lines[i]

        # Look for msgid entries (excluding header msgid "")
        if line.strip().startswith('msgid "') and line.strip() != 'msgid ""':
            # Extract msgid
            msgid = line.strip()[7:-1]  # Remove 'msgid "' and '"'
            msgid_start_line = i

            # Handle multiline msgid
            j = i + 1
            while j < len(lines) and lines[j].strip().startswith('"') and not lines[j].strip().startswith('msgstr'):
                msgid += lines[j].strip()[1:-1]
                j += 1

            # Check if next line is empty msgstr
            if j < len(lines) and lines[j].strip() == 'msgstr ""':
                # Get translation
                translation = translate_text(msgid, lang_code)

                if translation and translation != msgid:
                    # Update msgstr with translation
                    # Escape quotes in translation
                    escaped_translation = translation.replace('"', '\\"')
                    lines[j] = f'msgstr "{escaped_translation}"\n'
                    translated_count += 1
                else:
                    skipped_count += 1

                i = j + 1
                continue

        i += 1

    # Write back to file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(lines)

    return translated_count, skipped_count


def main():
    """Main function to process all language files"""
    languages_dir = '/Users/jnealey/Documents/GitHub/designsetgo/languages'

    # Language files to process
    lang_files = {
        'es_ES': 'designsetgo-es_ES.po',
        'fr_FR': 'designsetgo-fr_FR.po',
    }

    print("="*70)
    print(" DesignSetGo Translation Script")
    print("="*70)
    print()

    total_translated = 0
    total_skipped = 0

    for lang_code, filename in lang_files.items():
        filepath = os.path.join(languages_dir, filename)
        print(f"\nProcessing: {filename} ({lang_code})")
        print("-"*70)

        try:
            translated, skipped = update_po_file_with_translations(filepath, lang_code)
            total_translated += translated
            total_skipped += skipped

            print(f"  ✓ Translated: {translated} strings")
            print(f"  • Skipped: {skipped} strings (no translation available)")

        except Exception as e:
            print(f"  ✗ Error: {str(e)}")

    print()
    print("="*70)
    print(f" Summary")
    print("="*70)
    print(f"  Total translated: {total_translated} strings")
    print(f"  Total skipped: {total_skipped} strings")
    print()


if __name__ == '__main__':
    main()
