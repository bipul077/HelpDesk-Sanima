import React from "react";

const Ticketlogs = ({ item }) => {
  return (
    <div>
      <div className="d-flex mb-2">
        <div className="col-md-4">
          <strong>{new Date(item.createdAt).toLocaleString()}</strong>
        </div>{" "}
        <div className="col-md-8">
          {item.Status === 1 && (
            <p>Ticket has been created by {item.Created_By}.</p>
          )}
          {item.Status === 2 && (
            <p>
              Ticket has been assigned to {item.Assigned_to} by{" "}
              {item.Created_By}.
            </p>
          )}
          {item.Status === 3 && (
            <p>{item.Created_By} has replied to the ticket.</p>
          )}
          {item.Status === 4 && (
            <p>
              {item.Created_By} has changed the ticket status to '
              {item.Ticket_Status}'.
            </p>
          )}
          {item.Status === 5 && (
            <p>
              {item.Created_By} has changed the ticket Department to '
              {item.departments && item.departments.Name}'.
            </p>
          )}
          {item.Status === 6 && (
            <p>
              {item.Created_By} has changed the ticket Severity to '
              {item.severities && item.severities.Name}'.
            </p>
          )}
          {item.Status === 7 && (
            <p>
              {item.Created_By} has sent the ticket for acknowledgement to{" "}
              {item.Assigned_to}.
            </p>
          )}
          {item.Status === 8 && (
            <p>{item.Created_By} has acknowledged the Ticket.</p>
          )}
          {item.Status === 9 && (
            <p>{item.Created_By} has changed the Ticket Category/Subcategory to '{item.categories && item.categories.Name}/{item.subcategories ? item.subcategories.Name:'Null'}'.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ticketlogs;
