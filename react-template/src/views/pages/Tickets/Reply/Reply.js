import React from "react";
import { sanitize } from "isomorphic-dompurify";
import { formatDistance } from "date-fns";

const Reply = ({ replies }) => {
  // const getTimeDifference = (updatedAt) => {
  //   const updatedAtDate = new Date(updatedAt);
  //   const currentTime = new Date();
  //   const timeDifferenceInSeconds = Math.floor(
  //     (currentTime - updatedAtDate) / 1000 / 60
  //   );
  //   return timeDifferenceInSeconds;
  // };

  return (
    <div className="card p-3">
      <div>
        <div className="d-flex">
          <img
            src="./static/images/dpicon.png"
            width="40"
            height="40"
            className="rounded-circle p-1 mr-2 border"
            alt="image"
          />
          <p>{replies.Replied_By}</p>
        </div>
        <div className="ml-5">
          <p
            dangerouslySetInnerHTML={{ __html: sanitize(replies.Replies) }}
            style={{
              maxWidth: "700px",
              maxHeight: "400px",
              overflow: "auto",
            }}
          ></p>
          {replies.Ticketfiles.length > 0 && (
            <>
              <strong>Attachments</strong>
              <table className="table table-bordered mt-1">
                <tbody>
                  {replies.Ticketfiles.map((all, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>File {index + 1}</td>
                        <td>
                          <a
                            href={process.env.REACT_APP_API_URL + all.Name}
                            target="_blank"
                          >
                            {all.Name}
                          </a>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
        <hr />
        <div className="float-right">
          <span>Posted on: {new Date(replies.updatedAt).toLocaleString()}</span>
          <br />
          <span>
            (
            {formatDistance(new Date(replies.updatedAt), new Date(), {
              addSuffix: true,
            })}
            )
          </span>
        </div>
      </div>
    </div>
  );
};

export default Reply;
