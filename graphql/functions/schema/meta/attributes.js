const { gql } = require("apollo-server-cloud-functions");
const { content } = require("../../util/datahandler");

exports.typeDefs = gql`
    type Attribute {
        id: AttributeID!
        name: String!
        "Associated color of the attribute"
        color: String!
        "No idea what this is, but it's another color that's related somehow"
        guest_color: String!
        "Attribute icon image"
        icon: String!
        "The background for R cards of this attribute"
        card_background: String!
        "The icon background for R cards of this attribute"
        card_thumbnail_background: String!
    }

    enum AttributeID {
        SMILE
        PURE
        COOL
        ACTIVE
        NATURAL
        ELEGANT
    }
`;

exports.resolvers = {
    Attribute: {
        id: (parent) => parent.id,
        name: (parent) =>
            parent.id.charAt(0).toUpperCase() +
            parent.id.substr(1).toLowerCase(),
        color: (parent) => parent.color,
        guest_color: (parent) => parent.guest_color,
        icon: (parent) => content(parent.ui_image_asset),
        card_background: (parent) => content(parent.background_image_asset),
        card_thumbnail_background: (parent) =>
            content(parent.thumbnail_image_asset),
    },
    AttributeID: {
        SMILE: "smile",
        PURE: "pure",
        COOL: "cool",
        ACTIVE: "active",
        NATURAL: "natural",
        ELEGANT: "elegant",
    },
};
