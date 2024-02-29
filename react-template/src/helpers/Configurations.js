export const ckeditorConfiguration = {
    toolbar: {
        items: [
            'heading',
            '|',
            'bold',
            'italic',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'insertTable',
            'undo',
            'redo',
            'uploadImage'
        ]
    },
    image: {
        styles: [
            'alignLeft', 'alignCenter', 'alignRight'
        ],
        toolbar: [
            'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
            '|',
            'imageTextAlternative',
            '|',
            'toggleImageCaption',
        ]
    },
    table: {
        contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells'
        ]
    },
    placeholder: "Enter your text here...",
};