import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Editors = ({ content, onChange,key,responsevalue }) => {
  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append("Image", file);
            fetch(process.env.REACT_APP_API_URL + `api/addimage`, {
              method: "POST",
              body: body,
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            })
              .then((res) => res.json())
              .then((res) => {
                // console.log(res)
                if (res.error === "Invalid token") {
                  reject(new Error("Invalid token"));
                } else {
                  resolve({
                    default: process.env.REACT_APP_API_URL + res.imageUrls,
                  });
                }
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      },
    };
  }


  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  return (
    <div>
      <div className="App">
        {/* <h2>Using CKEditor 5 build in React</h2> */}
        <CKEditor
          key={key}
          editor={ClassicEditor}
          config={{
            extraPlugins: [uploadPlugin],
            placeholder: content,
          }}
          data={responsevalue||''}
          onChange={(event, editor) => {
            const data = editor.getData();
            onChange(data);
          }}
          onBlur={(event, editor) => {
            // console.log("Blur.", editor);
          }}
          onFocus={(event, editor) => {
            //console.log("Focus.", editor);
          }}
        />
      </div>
    </div>
  );
};

export default Editors;
