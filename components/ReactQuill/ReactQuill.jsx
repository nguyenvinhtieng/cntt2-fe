import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';


export default function ReactQuillEditer({initialVal = ""}) {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
        console.log(editorRef.current.getContent());
    }
  };

  return (
  <>
    <Editor
      onInit={(evt, editor) => editorRef.current = editor}
      onChange={log=>console.log(log)}
      initialValue={initialVal}
      init={{
      height: 500,
      menubar: false,
      plugins: [
        "print","preview","paste","importcss","searchreplace","autolink","autosave","save","directionality","code","visualblocks","visualchars","fullscreen","image","link","media","template","codesample","table","charmap","hr","pagebreak","nonbreaking","anchor","toc","insertdatetime","advlist","lists","wordcount","imagetools","textpattern","noneditable","help","charmap","quickbars","emoticons"
      ],
      // menubar: 'file edit view insert format tools table help',
      toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
      image_caption: true,
      quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
      noneditable_noneditable_class: 'mceNonEditable',
      toolbar_mode: 'sliding',
      contextmenu: 'link image imagetools table',
      }}
    />
  </>)
}
