#!/usr/bin/env python3
"""
Comprehensive WordPress Plugin Translation Script for DesignSetGo
Processes .po files and translates all msgid strings to target languages
"""

import re
import sys
from typing import Dict, List, Tuple

def get_translations(lang_code: str) -> Dict[str, str]:
    """
    Returns comprehensive translations for the given language code.
    This includes WordPress-specific terminology and UI conventions.
    """

    translations = {}

    if lang_code == 'es_ES':
        translations = {
            # Core plugin info
            'Modern Gutenberg block library bridging the gap between core WordPress blocks and advanced page builders. Design made easy, fast, and beautiful.':
                'Biblioteca moderna de bloques Gutenberg que cierra la brecha entre los bloques principales de WordPress y los constructores de páginas avanzados. Diseño fácil, rápido y hermoso.',

            # Common UI - Basic Actions
            'Add': 'Añadir',
            'Remove': 'Eliminar',
            'Delete': 'Borrar',
            'Edit': 'Editar',
            'Save': 'Guardar',
            'Cancel': 'Cancelar',
            'Update': 'Actualizar',
            'Insert': 'Insertar',
            'Select': 'Seleccionar',
            'Choose': 'Elegir',
            'Upload': 'Subir',
            'Download': 'Descargar',
            'Search': 'Buscar',
            'Filter': 'Filtrar',
            'Sort': 'Ordenar',
            'Reset': 'Restablecer',
            'Submit': 'Enviar',
            'Confirm': 'Confirmar',
            'Apply': 'Aplicar',
            'Clear': 'Limpiar',
            'Duplicate': 'Duplicar',
            'Copy': 'Copiar',
            'Paste': 'Pegar',
            'Undo': 'Deshacer',
            'Redo': 'Rehacer',

            # Common UI - Display/Visibility
            'Show': 'Mostrar',
            'Hide': 'Ocultar',
            'Toggle': 'Alternar',
            'Open': 'Abrir',
            'Close': 'Cerrar',
            'Expand': 'Expandir',
            'Collapse': 'Contraer',
            'View': 'Ver',
            'Preview': 'Vista previa',
            'Visible': 'Visible',
            'Hidden': 'Oculto',
            'Display': 'Visualización',
            'Visibility': 'Visibilidad',

            # Common UI - Navigation
            'Previous': 'Anterior',
            'Next': 'Siguiente',
            'Back': 'Atrás',
            'Forward': 'Adelante',
            'Go': 'Ir',
            'Navigate': 'Navegar',
            'Previous slide': 'Diapositiva anterior',
            'Next slide': 'Siguiente diapositiva',

            # Common UI - States
            'Active': 'Activo',
            'Inactive': 'Inactivo',
            'Enabled': 'Activado',
            'Disabled': 'Desactivado',
            'Enable': 'Activar',
            'Disable': 'Desactivar',
            'On': 'Activado',
            'Off': 'Desactivado',
            'Loading': 'Cargando',
            'Loading...': 'Cargando...',
            'Processing': 'Procesando',
            'Complete': 'Completado',
            'Pending': 'Pendiente',
            'Failed': 'Fallido',

            # Common UI - Settings Categories
            'General': 'General',
            'Settings': 'Ajustes',
            'Options': 'Opciones',
            'Advanced': 'Avanzado',
            'Basic': 'Básico',
            'Custom': 'Personalizado',
            'Default': 'Predeterminado',
            'None': 'Ninguno',
            'Auto': 'Automático',
            'Manual': 'Manual',

            # Common UI - Content Types
            'Content': 'Contenido',
            'Text': 'Texto',
            'Title': 'Título',
            'Description': 'Descripción',
            'Label': 'Etiqueta',
            'Caption': 'Leyenda',
            'Summary': 'Resumen',
            'Details': 'Detalles',
            'Information': 'Información',
            'Message': 'Mensaje',
            'Note': 'Nota',
            'Hint': 'Sugerencia',
            'Help': 'Ayuda',
            'Tooltip': 'Información sobre herramienta',

            # Common UI - Typography & Styling
            'Style': 'Estilo',
            'Styles': 'Estilos',
            'Typography': 'Tipografía',
            'Font': 'Fuente',
            'Size': 'Tamaño',
            'Weight': 'Grosor',
            'Color': 'Color',
            'Colors': 'Colores',
            'Background': 'Fondo',
            'Foreground': 'Primer plano',
            'Border': 'Borde',
            'Borders': 'Bordes',
            'Shadow': 'Sombra',
            'Opacity': 'Opacidad',
            'Transparency': 'Transparencia',

            # Layout & Spacing
            'Layout': 'Diseño',
            'Spacing': 'Espaciado',
            'Padding': 'Relleno',
            'Margin': 'Margen',
            'Gap': 'Espacio',
            'Width': 'Ancho',
            'Height': 'Alto',
            'Min Width': 'Ancho mínimo',
            'Max Width': 'Ancho máximo',
            'Min Height': 'Alto mínimo',
            'Max Height': 'Alto máximo',
            'Size': 'Tamaño',
            'Dimensions': 'Dimensiones',

            # Positioning & Alignment
            'Position': 'Posición',
            'Alignment': 'Alineación',
            'Align': 'Alinear',
            'Justify': 'Justificar',
            'Top': 'Arriba',
            'Bottom': 'Abajo',
            'Left': 'Izquierda',
            'Right': 'Derecha',
            'Center': 'Centro',
            'Middle': 'Medio',
            'Start': 'Inicio',
            'End': 'Fin',
            'Top Left': 'Superior izquierda',
            'Top Right': 'Superior derecha',
            'Bottom Left': 'Inferior izquierda',
            'Bottom Right': 'Inferior derecha',
            'Align Items': 'Alinear elementos',
            'Justify Content': 'Justificar contenido',

            # Direction & Orientation
            'Direction': 'Dirección',
            'Orientation': 'Orientación',
            'Horizontal': 'Horizontal',
            'Vertical': 'Vertical',
            'Row': 'Fila',
            'Column': 'Columna',
            'Columns': 'Columnas',
            'Rows': 'Filas',

            # Block Types & Container Names
            'Blocks': 'Bloques',
            'Block': 'Bloque',
            'Container': 'Contenedor',
            'Group': 'Grupo',
            'Section': 'Sección',
            'Wrapper': 'Envoltorio',
            'Inner Blocks': 'Bloques internos',

            # Specific Block Names
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
            'Icon': 'Icono',
            'Icons': 'Iconos',
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
            'Image': 'Imagen',
            'Images': 'Imágenes',
            'Image Accordion': 'Acordeón de imágenes',
            'Image Accordion Item': 'Elemento de acordeón de imágenes',
            'Blobs': 'Manchas',

            # Form Blocks
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
            'Select': 'Seleccionar',
            'Checkbox': 'Casilla de verificación',
            'Radio': 'Opción de radio',
            'Radio Group': 'Grupo de opciones de radio',
            'File Upload': 'Subida de archivos',
            'Hidden Field': 'Campo oculto',
            'Field': 'Campo',
            'Fields': 'Campos',
            'Form Fields': 'Campos del formulario',

            # Form Settings & Validation
            'Form Settings': 'Ajustes del formulario',
            'Form submission': 'Envío del formulario',
            'Submit button text': 'Texto del botón de envío',
            'Submit Button Text': 'Texto del botón de envío',
            'Success message': 'Mensaje de éxito',
            'Success Message': 'Mensaje de éxito',
            'Error message': 'Mensaje de error',
            'Error Message': 'Mensaje de error',
            'Validation': 'Validación',
            'Required': 'Obligatorio',
            'Optional': 'Opcional',
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
            'Min Length': 'Longitud mínima',
            'Max Length': 'Longitud máxima',
            'Minimum value': 'Valor mínimo',
            'Maximum value': 'Valor máximo',
            'Min Value': 'Valor mínimo',
            'Max Value': 'Valor máximo',
            'Min': 'Mín',
            'Max': 'Máx',
            'Pattern': 'Patrón',
            'Regex Pattern': 'Patrón regex',
            'Validation Pattern': 'Patrón de validación',

            # Form Field Attributes
            'Name': 'Nombre',
            'Value': 'Valor',
            'Default Value': 'Valor predeterminado',
            'Placeholder': 'Marcador de posición',
            'Type': 'Tipo',
            'ID': 'ID',
            'Class': 'Clase',
            'Autocomplete': 'Autocompletar',
            'Read Only': 'Solo lectura',
            'Readonly': 'Solo lectura',
            'Multiple': 'Múltiple',
            'Multiple files': 'Múltiples archivos',
            'Accept': 'Aceptar',
            'Max file size': 'Tamaño máximo de archivo',
            'Max File Size': 'Tamaño máximo de archivo',
            'Allowed file types': 'Tipos de archivo permitidos',
            'File types': 'Tipos de archivo',

            # Links & Buttons
            'Link': 'Enlace',
            'Links': 'Enlaces',
            'URL': 'URL',
            'Button': 'Botón',
            'Buttons': 'Botones',
            'Link URL': 'URL del enlace',
            'Open in new tab': 'Abrir en nueva pestaña',
            'Open in new window': 'Abrir en nueva ventana',
            'Target': 'Destino',
            'Rel': 'Rel',
            'No follow': 'No seguir',
            'Sponsored': 'Patrocinado',

            # Animation
            'Animation': 'Animación',
            'Animations': 'Animaciones',
            'Animate': 'Animar',
            'Duration': 'Duración',
            'Delay': 'Retraso',
            'Easing': 'Suavizado',
            'Transition': 'Transición',
            'Transform': 'Transformar',
            'Rotate': 'Rotar',
            'Scale': 'Escalar',
            'Translate': 'Trasladar',
            'Fade': 'Desvanecer',
            'Slide': 'Deslizar',
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

            # Responsive & Breakpoints
            'Responsive': 'Adaptable',
            'Breakpoint': 'Punto de quiebre',
            'Breakpoints': 'Puntos de quiebre',
            'Desktop': 'Escritorio',
            'Tablet': 'Tableta',
            'Mobile': 'Móvil',
            'Phone': 'Teléfono',
            'Screen': 'Pantalla',
            'Device': 'Dispositivo',

            # Grid & Flexbox
            'Grid': 'Cuadrícula',
            'Flex': 'Flex',
            'Stack': 'Pila',
            'Flex Direction': 'Dirección de Flex',
            'Flex Wrap': 'Envoltura de Flex',
            'Wrap': 'Envolver',
            'Nowrap': 'Sin envolver',
            'Stretch': 'Estirar',
            'Space Between': 'Espacio entre',
            'Space Around': 'Espacio alrededor',
            'Space Evenly': 'Espacio uniforme',
            'Grid Template': 'Plantilla de cuadrícula',
            'Grid Template Columns': 'Columnas de plantilla de cuadrícula',
            'Grid Template Rows': 'Filas de plantilla de cuadrícula',
            'Column Gap': 'Espacio entre columnas',
            'Row Gap': 'Espacio entre filas',
            'Auto': 'Automático',
            'Auto-fit': 'Ajuste automático',
            'Auto-fill': 'Relleno automático',

            # Display & Visibility
            'Block': 'Bloque',
            'Inline': 'En línea',
            'Inline Block': 'Bloque en línea',
            'Flex': 'Flex',
            'Grid': 'Cuadrícula',
            'Hidden': 'Oculto',
            'Visible': 'Visible',
            'Show on Desktop': 'Mostrar en escritorio',
            'Show on Tablet': 'Mostrar en tableta',
            'Show on Mobile': 'Mostrar en móvil',
            'Hide on Desktop': 'Ocultar en escritorio',
            'Hide on Tablet': 'Ocultar en tableta',
            'Hide on Mobile': 'Ocultar en móvil',

            # Image & Media
            'Image': 'Imagen',
            'Images': 'Imágenes',
            'Media': 'Medios',
            'Video': 'Vídeo',
            'Audio': 'Audio',
            'Gallery': 'Galería',
            'Thumbnail': 'Miniatura',
            'Full Size': 'Tamaño completo',
            'Large': 'Grande',
            'Medium': 'Mediano',
            'Small': 'Pequeño',
            'Aspect Ratio': 'Relación de aspecto',
            'Object Fit': 'Ajuste de objeto',
            'Cover': 'Cubrir',
            'Contain': 'Contener',
            'Fill': 'Rellenar',
            'Scale Down': 'Reducir escala',
            'Image Width': 'Ancho de imagen',
            'Image Height': 'Alto de imagen',

            # Common Sizes
            'Extra Small': 'Extra pequeño',
            'Small': 'Pequeño',
            'Medium': 'Mediano',
            'Large': 'Grande',
            'Extra Large': 'Extra grande',
            'Full': 'Completo',
            'Half': 'Mitad',
            'Third': 'Tercio',
            'Quarter': 'Cuarto',
            'Custom': 'Personalizado',

            # Boolean & Status
            'Yes': 'Sí',
            'No': 'No',
            'True': 'Verdadero',
            'False': 'Falso',
            'Success': 'Éxito',
            'Error': 'Error',
            'Warning': 'Advertencia',
            'Info': 'Información',
            'Notice': 'Aviso',
            'Alert': 'Alerta',

            # Common Actions & Messages
            'Loading...': 'Cargando...',
            'Please wait': 'Por favor espere',
            'Processing...': 'Procesando...',
            'Saving...': 'Guardando...',
            'Loading': 'Cargando',
            'Processing': 'Procesando',
            'Saving': 'Guardando',
            'Saved': 'Guardado',
            'No items found': 'No se encontraron elementos',
            'No results': 'Sin resultados',
            'No submissions found': 'No se encontraron envíos',
            'Are you sure?': '¿Está seguro?',
            'This action cannot be undone': 'Esta acción no se puede deshacer',
            'Changes saved': 'Cambios guardados',
            'Changes not saved': 'Cambios no guardados',
            'Something went wrong': 'Algo salió mal',
            'Try again': 'Intentar de nuevo',
            'Learn more': 'Más información',
            'Read more': 'Leer más',
            'Show more': 'Mostrar más',
            'Show less': 'Mostrar menos',

            # Documentation & Support
            'Documentation': 'Documentación',
            'Support': 'Soporte',
            'Help': 'Ayuda',
            'Tutorial': 'Tutorial',
            'Guide': 'Guía',
            'Examples': 'Ejemplos',
            'Demo': 'Demostración',

            # Plugin Meta
            'Version': 'Versión',
            'Author': 'Autor',
            'License': 'Licencia',
            'Plugin': 'Plugin',
            'Theme': 'Tema',
            'Widget': 'Widget',
            'Extension': 'Extensión',
            'Add-on': 'Complemento',

            # Permissions & Errors
            'Post not found.': 'Entrada no encontrada.',
            'Page not found.': 'Página no encontrada.',
            'You do not have permission to edit this post.': 'No tiene permiso para editar esta entrada.',
            'You do not have permission to access this page.': 'No tiene permiso para acceder a esta página.',
            'No matching blocks found to update.': 'No se encontraron bloques coincidentes para actualizar.',
            'Whether the operation was successful': 'Si la operación fue exitosa',
            'Post ID where blocks were updated': 'ID de entrada donde se actualizaron los bloques',
            'Number of blocks updated': 'Número de bloques actualizados',
            'Target post ID': 'ID de entrada objetivo',
            'Specific block client ID to update (optional)': 'ID de cliente de bloque específico para actualizar (opcional)',
            'Whether to update all matching blocks or just the first': 'Si actualizar todos los bloques coincidentes o solo el primero',

            # Abilities & API
            'Abilities that provide information about blocks and capabilities': 'Capacidades que proporcionan información sobre bloques y funcionalidades',
            'Abilities for inserting and configuring blocks': 'Capacidades para insertar y configurar bloques',
            'Information': 'Información',

            # Block Descriptions
            'A modern, performant slider with multiple transition effects, auto-play, and full block support inside slides.':
                'Un deslizador moderno y eficiente con múltiples efectos de transición, reproducción automática y soporte completo de bloques dentro de diapositivas.',
            '3D card that flips on hover to reveal back content.':
                'Tarjeta 3D que gira al pasar el cursor para revelar el contenido posterior.',
            '3D flip card container':
                'Contenedor de tarjeta giratoria 3D',
            'A button with optional icon at the start or end.':
                'Un botón con icono opcional al principio o al final.',
            'A single item in an icon list with icon, title, and description.':
                'Un elemento individual en una lista de iconos con icono, título y descripción.',
            'A dropdown select field for forms.':
                'Un campo de selección desplegable para formularios.',
            'A file upload field for forms.':
                'Un campo de subida de archivos para formularios.',
            'A hidden field for passing data in forms.':
                'Un campo oculto para pasar datos en formularios.',
            'A number input field for forms.':
                'Un campo de entrada numérica para formularios.',
            'A phone number input field for forms.':
                'Un campo de entrada de número de teléfono para formularios.',
            'A single checkbox field for forms.':
                'Un campo de casilla de verificación individual para formularios.',
            'A date picker input field for forms.':
                'Un campo de entrada de selector de fecha para formularios.',
            'A time picker input field for forms.':
                'Un campo de entrada de selector de hora para formularios.',
            'A URL/website address input field for forms.':
                'Un campo de entrada de URL/dirección de sitio web para formularios.',

            # Technical terms with context
            'AJAX Submit': 'Envío AJAX',
            'ARIA Label': 'Etiqueta ARIA',
            'Accessibility': 'Accesibilidad',
            'Accessible': 'Accesible',
            'Screen Reader': 'Lector de pantalla',
            'Alt Text': 'Texto alternativo',
            'Alternative Text': 'Texto alternativo',

            # Counter & Progress
            'Count': 'Cuenta',
            'Counter': 'Contador',
            'Start Value': 'Valor inicial',
            'End Value': 'Valor final',
            'Increment': 'Incremento',
            'Progress': 'Progreso',
            'Percentage': 'Porcentaje',
            'Bar Color': 'Color de barra',
            'Track Color': 'Color de pista',

            # Tabs specific
            'Tab alignment': 'Alineación de pestañas',
            'Tab attributes including title and icon': 'Atributos de pestaña que incluyen título e icono',
            'Gap between tabs (e.g.,': 'Espacio entre pestañas (ej.,',

            # Accordion specific
            'Scroll direction for this row': 'Dirección de desplazamiento para esta fila',
            'Controls how fast images move based on scroll': 'Controla qué tan rápido se mueven las imágenes según el desplazamiento',

            # Animation specific
            'Animation easing function': 'Función de suavizado de animación',
            'Delay:': 'Retraso:',

            # Slider specific
            'Full-height slider for hero sections with centered content':
                'Deslizador de altura completa para secciones hero con contenido centrado',
            'Previous slide': 'Diapositiva anterior',
            'Next slide': 'Siguiente diapositiva',

            # Form specific
            'Maximum characters allowed (0 = no limit)': 'Máximo de caracteres permitidos (0 = sin límite)',
            'Hidden Field:': 'Campo oculto:',

            # Insert actions
            'Insert Icon List Item': 'Insertar elemento de lista de iconos',

            # Special formatting
            'show': 'mostrar',
            '(empty)': '(vacío)',
            '25%': '25%',
            '50%': '50%',
            '75%': '75%',
            '100%': '100%',

            # Size variations
            '2XS — 4px': '2XS — 4px',
            'XS — 8px': 'XS — 8px',
            'SM — 12px': 'SM — 12px',
            'MD — 16px': 'MD — 16px',
            'LG — 24px': 'LG — 24px',
            'XL — 32px': 'XL — 32px',
            '2XL — 48px': '2XL — 48px',
            '3XL — 64px': '3XL — 64px',
            '4XL — 80px': '4XL — 80px',
            '5XL — 96px': '5XL — 96px',

            # Breakpoint ranges
            '<768px': '<768px',
            '768px - 1023px': '768px - 1023px',
            '>1024px': '>1024px',

            # Special descriptions
            ' (duplicated 6x for infinite scroll)': ' (duplicado 6 veces para desplazamiento infinito)',
            ' images. For best performance, consider using fewer images (20 or less) or optimizing image sizes. Each image is duplicated 6 times for smooth infinite scrolling.':
                ' imágenes. Para un mejor rendimiento, considere usar menos imágenes (20 o menos) u optimizar los tamaños de imagen. Cada imagen se duplica 6 veces para un desplazamiento infinito suave.',

            # 3D effect
            '3d': '3d',

            # Flip direction
            'Flip direction (only applies to': 'Dirección de giro (solo se aplica a',

            # Keep technical terms
            'Flexbox': 'Flexbox',
            'CSS': 'CSS',
            'HTML': 'HTML',
            'JavaScript': 'JavaScript',
            'JSON': 'JSON',
            'API': 'API',
        }

    elif lang_code == 'fr_FR':
        translations = {
            # Core plugin info
            'Modern Gutenberg block library bridging the gap between core WordPress blocks and advanced page builders. Design made easy, fast, and beautiful.':
                'Bibliothèque moderne de blocs Gutenberg comblant le fossé entre les blocs WordPress de base et les constructeurs de pages avancés. Conception facile, rapide et belle.',

            # Common UI - Basic Actions
            'Add': 'Ajouter',
            'Remove': 'Retirer',
            'Delete': 'Supprimer',
            'Edit': 'Modifier',
            'Save': 'Enregistrer',
            'Cancel': 'Annuler',
            'Update': 'Mettre à jour',
            'Insert': 'Insérer',
            'Select': 'Sélectionner',
            'Choose': 'Choisir',
            'Upload': 'Téléverser',
            'Download': 'Télécharger',
            'Search': 'Rechercher',
            'Filter': 'Filtrer',
            'Sort': 'Trier',
            'Reset': 'Réinitialiser',
            'Submit': 'Envoyer',
            'Confirm': 'Confirmer',
            'Apply': 'Appliquer',
            'Clear': 'Effacer',
            'Duplicate': 'Dupliquer',
            'Copy': 'Copier',
            'Paste': 'Coller',
            'Undo': 'Annuler',
            'Redo': 'Rétablir',

            # Common UI - Display/Visibility
            'Show': 'Afficher',
            'Hide': 'Masquer',
            'Toggle': 'Basculer',
            'Open': 'Ouvrir',
            'Close': 'Fermer',
            'Expand': 'Développer',
            'Collapse': 'Réduire',
            'View': 'Voir',
            'Preview': 'Aperçu',
            'Visible': 'Visible',
            'Hidden': 'Masqué',
            'Display': 'Affichage',
            'Visibility': 'Visibilité',

            # Common UI - Navigation
            'Previous': 'Précédent',
            'Next': 'Suivant',
            'Back': 'Retour',
            'Forward': 'Avant',
            'Go': 'Aller',
            'Navigate': 'Naviguer',
            'Previous slide': 'Diapositive précédente',
            'Next slide': 'Diapositive suivante',

            # Common UI - States
            'Active': 'Actif',
            'Inactive': 'Inactif',
            'Enabled': 'Activé',
            'Disabled': 'Désactivé',
            'Enable': 'Activer',
            'Disable': 'Désactiver',
            'On': 'Activé',
            'Off': 'Désactivé',
            'Loading': 'Chargement',
            'Loading...': 'Chargement...',
            'Processing': 'Traitement',
            'Complete': 'Terminé',
            'Pending': 'En attente',
            'Failed': 'Échoué',

            # Common UI - Settings Categories
            'General': 'Général',
            'Settings': 'Réglages',
            'Options': 'Options',
            'Advanced': 'Avancé',
            'Basic': 'Basique',
            'Custom': 'Personnalisé',
            'Default': 'Par défaut',
            'None': 'Aucun',
            'Auto': 'Automatique',
            'Manual': 'Manuel',

            # Common UI - Content Types
            'Content': 'Contenu',
            'Text': 'Texte',
            'Title': 'Titre',
            'Description': 'Description',
            'Label': 'Étiquette',
            'Caption': 'Légende',
            'Summary': 'Résumé',
            'Details': 'Détails',
            'Information': 'Information',
            'Message': 'Message',
            'Note': 'Note',
            'Hint': 'Indice',
            'Help': 'Aide',
            'Tooltip': 'Info-bulle',

            # Common UI - Typography & Styling
            'Style': 'Style',
            'Styles': 'Styles',
            'Typography': 'Typographie',
            'Font': 'Police',
            'Size': 'Taille',
            'Weight': 'Graisse',
            'Color': 'Couleur',
            'Colors': 'Couleurs',
            'Background': 'Arrière-plan',
            'Foreground': 'Premier plan',
            'Border': 'Bordure',
            'Borders': 'Bordures',
            'Shadow': 'Ombre',
            'Opacity': 'Opacité',
            'Transparency': 'Transparence',

            # Layout & Spacing
            'Layout': 'Mise en page',
            'Spacing': 'Espacement',
            'Padding': 'Marge intérieure',
            'Margin': 'Marge extérieure',
            'Gap': 'Espacement',
            'Width': 'Largeur',
            'Height': 'Hauteur',
            'Min Width': 'Largeur minimale',
            'Max Width': 'Largeur maximale',
            'Min Height': 'Hauteur minimale',
            'Max Height': 'Hauteur maximale',
            'Size': 'Taille',
            'Dimensions': 'Dimensions',

            # Positioning & Alignment
            'Position': 'Position',
            'Alignment': 'Alignement',
            'Align': 'Aligner',
            'Justify': 'Justifier',
            'Top': 'Haut',
            'Bottom': 'Bas',
            'Left': 'Gauche',
            'Right': 'Droite',
            'Center': 'Centre',
            'Middle': 'Milieu',
            'Start': 'Début',
            'End': 'Fin',
            'Top Left': 'Haut gauche',
            'Top Right': 'Haut droite',
            'Bottom Left': 'Bas gauche',
            'Bottom Right': 'Bas droite',
            'Align Items': 'Aligner les éléments',
            'Justify Content': 'Justifier le contenu',

            # Direction & Orientation
            'Direction': 'Direction',
            'Orientation': 'Orientation',
            'Horizontal': 'Horizontal',
            'Vertical': 'Vertical',
            'Row': 'Ligne',
            'Column': 'Colonne',
            'Columns': 'Colonnes',
            'Rows': 'Lignes',

            # Block Types & Container Names
            'Blocks': 'Blocs',
            'Block': 'Bloc',
            'Container': 'Conteneur',
            'Group': 'Groupe',
            'Section': 'Section',
            'Wrapper': 'Enveloppe',
            'Inner Blocks': 'Blocs internes',

            # Specific Block Names
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
            'Icon': 'Icône',
            'Icons': 'Icônes',
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
            'Image': 'Image',
            'Images': 'Images',
            'Image Accordion': 'Accordéon d\'images',
            'Image Accordion Item': 'Élément d\'accordéon d\'images',
            'Blobs': 'Taches',

            # Form Blocks
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
            'Select': 'Sélection',
            'Checkbox': 'Case à cocher',
            'Radio': 'Bouton radio',
            'Radio Group': 'Groupe de boutons radio',
            'File Upload': 'Téléversement de fichier',
            'Hidden Field': 'Champ masqué',
            'Field': 'Champ',
            'Fields': 'Champs',
            'Form Fields': 'Champs du formulaire',

            # Form Settings & Validation
            'Form Settings': 'Paramètres du formulaire',
            'Form submission': 'Soumission du formulaire',
            'Submit button text': 'Texte du bouton d\'envoi',
            'Submit Button Text': 'Texte du bouton d\'envoi',
            'Success message': 'Message de succès',
            'Success Message': 'Message de succès',
            'Error message': 'Message d\'erreur',
            'Error Message': 'Message d\'erreur',
            'Validation': 'Validation',
            'Required': 'Obligatoire',
            'Optional': 'Optionnel',
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
            'Min Length': 'Longueur minimale',
            'Max Length': 'Longueur maximale',
            'Minimum value': 'Valeur minimale',
            'Maximum value': 'Valeur maximale',
            'Min Value': 'Valeur minimale',
            'Max Value': 'Valeur maximale',
            'Min': 'Min',
            'Max': 'Max',
            'Pattern': 'Modèle',
            'Regex Pattern': 'Modèle regex',
            'Validation Pattern': 'Modèle de validation',

            # Form Field Attributes
            'Name': 'Nom',
            'Value': 'Valeur',
            'Default Value': 'Valeur par défaut',
            'Placeholder': 'Espace réservé',
            'Type': 'Type',
            'ID': 'ID',
            'Class': 'Classe',
            'Autocomplete': 'Saisie automatique',
            'Read Only': 'Lecture seule',
            'Readonly': 'Lecture seule',
            'Multiple': 'Multiple',
            'Multiple files': 'Fichiers multiples',
            'Accept': 'Accepter',
            'Max file size': 'Taille maximale du fichier',
            'Max File Size': 'Taille maximale du fichier',
            'Allowed file types': 'Types de fichiers autorisés',
            'File types': 'Types de fichiers',

            # Links & Buttons
            'Link': 'Lien',
            'Links': 'Liens',
            'URL': 'URL',
            'Button': 'Bouton',
            'Buttons': 'Boutons',
            'Link URL': 'URL du lien',
            'Open in new tab': 'Ouvrir dans un nouvel onglet',
            'Open in new window': 'Ouvrir dans une nouvelle fenêtre',
            'Target': 'Cible',
            'Rel': 'Rel',
            'No follow': 'No follow',
            'Sponsored': 'Sponsorisé',

            # Animation
            'Animation': 'Animation',
            'Animations': 'Animations',
            'Animate': 'Animer',
            'Duration': 'Durée',
            'Delay': 'Délai',
            'Easing': 'Lissage',
            'Transition': 'Transition',
            'Transform': 'Transformation',
            'Rotate': 'Rotation',
            'Scale': 'Échelle',
            'Translate': 'Translation',
            'Fade': 'Fondu',
            'Slide': 'Glissement',
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

            # Responsive & Breakpoints
            'Responsive': 'Adaptatif',
            'Breakpoint': 'Point de rupture',
            'Breakpoints': 'Points de rupture',
            'Desktop': 'Bureau',
            'Tablet': 'Tablette',
            'Mobile': 'Mobile',
            'Phone': 'Téléphone',
            'Screen': 'Écran',
            'Device': 'Appareil',

            # Grid & Flexbox
            'Grid': 'Grille',
            'Flex': 'Flex',
            'Stack': 'Pile',
            'Flex Direction': 'Direction Flex',
            'Flex Wrap': 'Retour Flex',
            'Wrap': 'Retour à la ligne',
            'Nowrap': 'Sans retour',
            'Stretch': 'Étirer',
            'Space Between': 'Espace entre',
            'Space Around': 'Espace autour',
            'Space Evenly': 'Espace uniforme',
            'Grid Template': 'Modèle de grille',
            'Grid Template Columns': 'Colonnes du modèle de grille',
            'Grid Template Rows': 'Lignes du modèle de grille',
            'Column Gap': 'Espacement des colonnes',
            'Row Gap': 'Espacement des lignes',
            'Auto': 'Automatique',
            'Auto-fit': 'Ajustement automatique',
            'Auto-fill': 'Remplissage automatique',

            # Display & Visibility
            'Block': 'Bloc',
            'Inline': 'En ligne',
            'Inline Block': 'Bloc en ligne',
            'Show on Desktop': 'Afficher sur bureau',
            'Show on Tablet': 'Afficher sur tablette',
            'Show on Mobile': 'Afficher sur mobile',
            'Hide on Desktop': 'Masquer sur bureau',
            'Hide on Tablet': 'Masquer sur tablette',
            'Hide on Mobile': 'Masquer sur mobile',

            # Image & Media
            'Image': 'Image',
            'Images': 'Images',
            'Media': 'Médias',
            'Video': 'Vidéo',
            'Audio': 'Audio',
            'Gallery': 'Galerie',
            'Thumbnail': 'Miniature',
            'Full Size': 'Taille complète',
            'Large': 'Grande',
            'Medium': 'Moyenne',
            'Small': 'Petite',
            'Aspect Ratio': 'Rapport d\'aspect',
            'Object Fit': 'Ajustement d\'objet',
            'Cover': 'Couvrir',
            'Contain': 'Contenir',
            'Fill': 'Remplir',
            'Scale Down': 'Réduire l\'échelle',
            'Image Width': 'Largeur de l\'image',
            'Image Height': 'Hauteur de l\'image',

            # Common Sizes
            'Extra Small': 'Très petit',
            'Small': 'Petit',
            'Medium': 'Moyen',
            'Large': 'Grand',
            'Extra Large': 'Très grand',
            'Full': 'Complet',
            'Half': 'Moitié',
            'Third': 'Tiers',
            'Quarter': 'Quart',
            'Custom': 'Personnalisé',

            # Boolean & Status
            'Yes': 'Oui',
            'No': 'Non',
            'True': 'Vrai',
            'False': 'Faux',
            'Success': 'Succès',
            'Error': 'Erreur',
            'Warning': 'Avertissement',
            'Info': 'Information',
            'Notice': 'Avis',
            'Alert': 'Alerte',

            # Common Actions & Messages
            'Loading...': 'Chargement...',
            'Please wait': 'Veuillez patienter',
            'Processing...': 'Traitement...',
            'Saving...': 'Enregistrement...',
            'Loading': 'Chargement',
            'Processing': 'Traitement',
            'Saving': 'Enregistrement',
            'Saved': 'Enregistré',
            'No items found': 'Aucun élément trouvé',
            'No results': 'Aucun résultat',
            'No submissions found': 'Aucune soumission trouvée',
            'Are you sure?': 'Êtes-vous sûr ?',
            'This action cannot be undone': 'Cette action ne peut pas être annulée',
            'Changes saved': 'Modifications enregistrées',
            'Changes not saved': 'Modifications non enregistrées',
            'Something went wrong': 'Quelque chose s\'est mal passé',
            'Try again': 'Réessayer',
            'Learn more': 'En savoir plus',
            'Read more': 'Lire la suite',
            'Show more': 'Afficher plus',
            'Show less': 'Afficher moins',

            # Documentation & Support
            'Documentation': 'Documentation',
            'Support': 'Support',
            'Help': 'Aide',
            'Tutorial': 'Tutoriel',
            'Guide': 'Guide',
            'Examples': 'Exemples',
            'Demo': 'Démonstration',

            # Plugin Meta
            'Version': 'Version',
            'Author': 'Auteur',
            'License': 'Licence',
            'Plugin': 'Extension',
            'Theme': 'Thème',
            'Widget': 'Widget',
            'Extension': 'Extension',
            'Add-on': 'Module complémentaire',

            # Permissions & Errors
            'Post not found.': 'Article non trouvé.',
            'Page not found.': 'Page non trouvée.',
            'You do not have permission to edit this post.': 'Vous n\'avez pas la permission de modifier cet article.',
            'You do not have permission to access this page.': 'Vous n\'avez pas la permission d\'accéder à cette page.',
            'No matching blocks found to update.': 'Aucun bloc correspondant trouvé pour la mise à jour.',
            'Whether the operation was successful': 'Si l\'opération a réussi',
            'Post ID where blocks were updated': 'ID de l\'article où les blocs ont été mis à jour',
            'Number of blocks updated': 'Nombre de blocs mis à jour',
            'Target post ID': 'ID de l\'article cible',
            'Specific block client ID to update (optional)': 'ID client du bloc spécifique à mettre à jour (optionnel)',
            'Whether to update all matching blocks or just the first': 'Mettre à jour tous les blocs correspondants ou seulement le premier',

            # Abilities & API
            'Abilities that provide information about blocks and capabilities': 'Capacités fournissant des informations sur les blocs et fonctionnalités',
            'Abilities for inserting and configuring blocks': 'Capacités pour insérer et configurer les blocs',
            'Information': 'Information',

            # Block Descriptions
            'A modern, performant slider with multiple transition effects, auto-play, and full block support inside slides.':
                'Un curseur moderne et performant avec plusieurs effets de transition, lecture automatique et prise en charge complète des blocs dans les diapositives.',
            '3D card that flips on hover to reveal back content.':
                'Carte 3D qui se retourne au survol pour révéler le contenu arrière.',
            '3D flip card container':
                'Conteneur de carte à retourner 3D',
            'A button with optional icon at the start or end.':
                'Un bouton avec icône optionnelle au début ou à la fin.',
            'A single item in an icon list with icon, title, and description.':
                'Un élément unique dans une liste d\'icônes avec icône, titre et description.',
            'A dropdown select field for forms.':
                'Un champ de sélection déroulant pour les formulaires.',
            'A file upload field for forms.':
                'Un champ de téléversement de fichier pour les formulaires.',
            'A hidden field for passing data in forms.':
                'Un champ masqué pour transmettre des données dans les formulaires.',
            'A number input field for forms.':
                'Un champ de saisie numérique pour les formulaires.',
            'A phone number input field for forms.':
                'Un champ de saisie de numéro de téléphone pour les formulaires.',
            'A single checkbox field for forms.':
                'Un champ de case à cocher unique pour les formulaires.',
            'A date picker input field for forms.':
                'Un champ de saisie de sélecteur de date pour les formulaires.',
            'A time picker input field for forms.':
                'Un champ de saisie de sélecteur d\'heure pour les formulaires.',
            'A URL/website address input field for forms.':
                'Un champ de saisie d\'adresse URL/site web pour les formulaires.',

            # Technical terms with context
            'AJAX Submit': 'Soumission AJAX',
            'ARIA Label': 'Étiquette ARIA',
            'Accessibility': 'Accessibilité',
            'Accessible': 'Accessible',
            'Screen Reader': 'Lecteur d\'écran',
            'Alt Text': 'Texte alternatif',
            'Alternative Text': 'Texte alternatif',

            # Counter & Progress
            'Count': 'Compte',
            'Counter': 'Compteur',
            'Start Value': 'Valeur de départ',
            'End Value': 'Valeur finale',
            'Increment': 'Incrément',
            'Progress': 'Progression',
            'Percentage': 'Pourcentage',
            'Bar Color': 'Couleur de la barre',
            'Track Color': 'Couleur de la piste',

            # Tabs specific
            'Tab alignment': 'Alignement des onglets',
            'Tab attributes including title and icon': 'Attributs de l\'onglet incluant le titre et l\'icône',
            'Gap between tabs (e.g.,': 'Espacement entre les onglets (ex.,',

            # Accordion specific
            'Scroll direction for this row': 'Direction de défilement pour cette ligne',
            'Controls how fast images move based on scroll': 'Contrôle la vitesse de déplacement des images en fonction du défilement',

            # Animation specific
            'Animation easing function': 'Fonction de lissage d\'animation',
            'Delay:': 'Délai :',

            # Slider specific
            'Full-height slider for hero sections with centered content':
                'Curseur pleine hauteur pour les sections hero avec contenu centré',
            'Previous slide': 'Diapositive précédente',
            'Next slide': 'Diapositive suivante',

            # Form specific
            'Maximum characters allowed (0 = no limit)': 'Caractères maximums autorisés (0 = aucune limite)',
            'Hidden Field:': 'Champ masqué :',

            # Insert actions
            'Insert Icon List Item': 'Insérer un élément de liste d\'icônes',

            # Special formatting
            'show': 'afficher',
            '(empty)': '(vide)',
            '25%': '25%',
            '50%': '50%',
            '75%': '75%',
            '100%': '100%',

            # Size variations
            '2XS — 4px': '2XS — 4px',
            'XS — 8px': 'XS — 8px',
            'SM — 12px': 'SM — 12px',
            'MD — 16px': 'MD — 16px',
            'LG — 24px': 'LG — 24px',
            'XL — 32px': 'XL — 32px',
            '2XL — 48px': '2XL — 48px',
            '3XL — 64px': '3XL — 64px',
            '4XL — 80px': '4XL — 80px',
            '5XL — 96px': '5XL — 96px',

            # Breakpoint ranges
            '<768px': '<768px',
            '768px - 1023px': '768px - 1023px',
            '>1024px': '>1024px',

            # Special descriptions
            ' (duplicated 6x for infinite scroll)': ' (dupliqué 6 fois pour le défilement infini)',
            ' images. For best performance, consider using fewer images (20 or less) or optimizing image sizes. Each image is duplicated 6 times for smooth infinite scrolling.':
                ' images. Pour de meilleures performances, envisagez d\'utiliser moins d\'images (20 ou moins) ou d\'optimiser les tailles d\'image. Chaque image est dupliquée 6 fois pour un défilement infini fluide.',

            # 3D effect
            '3d': '3d',

            # Flip direction
            'Flip direction (only applies to': 'Direction de retournement (s\'applique uniquement à',
        }

    return translations

def process_po_file(filepath: str, lang_code: str):
    """
    Process a .po file and translate all empty msgstr entries.
    """
    print(f"\nProcessing {filepath} for language {lang_code}...")

    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    translations = get_translations(lang_code)
    translated_count = 0
    skipped_count = 0

    i = 0
    while i < len(lines):
        line = lines[i]

        # Look for msgid lines
        if line.strip().startswith('msgid "') and line.strip() != 'msgid ""':
            # Extract the msgid value
            msgid_start = i
            msgid = line.strip()[7:-1]  # Remove 'msgid "' and '"'

            # Handle multiline msgid
            j = i + 1
            while j < len(lines) and lines[j].strip().startswith('"') and not lines[j].strip().startswith('msgstr'):
                msgid += lines[j].strip()[1:-1]  # Remove '"' from both ends
                j += 1

            # Check if the next line is an empty msgstr
            if j < len(lines) and lines[j].strip() == 'msgstr ""':
                # Try to find translation
                translation = translations.get(msgid, '')

                if translation:
                    # Replace empty msgstr with translation
                    lines[j] = f'msgstr "{translation}"\n'
                    translated_count += 1
                else:
                    skipped_count += 1

                i = j + 1
                continue

        i += 1

    # Write the modified content back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(lines)

    print(f"  Translated: {translated_count} strings")
    print(f"  Skipped (no translation): {skipped_count} strings")

    return translated_count, skipped_count

if __name__ == '__main__':
    # For testing
    lang_code = 'es_ES'
    filepath = f'/Users/jnealey/Documents/GitHub/designsetgo/languages/designsetgo-{lang_code}.po'
    process_po_file(filepath, lang_code)
