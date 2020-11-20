const { gql } = require("apollo-server-cloud-functions");
const { content } = require("../../util/datahandler");

exports.typeDefs = gql`
    type Member {
        id: Int!
        group: MemberGroup!
        unit: MemberUnit
        "School year for this member"
        grade: Int!
        "Base image color"
        color: String!
        "Lighter image color"
        color_light: String!
        "Darker image color"
        color_dark: String!
        name: LocalizedString!
        "Height as a string with 'cm' appended"
        height: String!
        birth_month: Int!
        birth_day: Int!
        "Transparent portrait image displaying the member"
        portrait: String!
        "Member's signature, transparent"
        signature: String!
        "Large white version of member's icon"
        icon: String!
        "Smaller version of 'icon'"
        icon_small: String!
        "Colored, small version of the icon"
        icon_colored: String!
        "Squareish thumbnail with member's face"
        thumbnail: String!
        "Very small circular thumbnail with member's face"
        small_still: String!
    }

    enum MemberGroupID {
        MUSE
        AQOURS
        NIJIGASAKI
    }

    type MemberGroup {
        id: MemberGroupID
        name: LocalizedString
        "Colored logo"
        logo: String
        "White-only version of the logo"
        logo_white: String
        "Group's image color"
        color: String
    }

    enum MemberUnitID {
        PRINTEMPS
        BIBI
        LILY_WHITE
        CYARON
        AZALEA
        GUILTY_KISS
        AZUNA
        DIVER_DIVA
        QU4RTZ
    }

    type MemberUnit {
        id: MemberUnitID
        name: LocalizedString
        "Colored logo"
        logo: String
    }
`;

exports.resolvers = {
    Member: {
        id: (parent) => parent.id,
        group: (parent) => parent.group,
        unit: (parent) => parent.unit,
        grade: (parent) => parent.grade,
        color: (parent) => parent.color,
        color_light: (parent) => parent.color_light,
        color_dark: (parent) => parent.color_dark,
        name: (parent) => ({ jp: parent.name_jp, en: parent.name_en }),
        height: (parent) => parent.height,
        birth_month: (parent) => parent.birth_month,
        birth_day: (parent) => parent.birth_day,
        portrait: (parent) => content(parent.standing_image_asset),
        signature: (parent) => content(parent.autograph_image_asset),
        icon: (parent) => content(parent.icon_image_asset),
        icon_small: (parent) => content(parent.icon_small_image_asset),
        icon_colored: (parent) => content(parent.icon_color_image_asset),
        thumbnail: (parent) => content(parent.thumbnail_image_asset),
        small_still: (parent) => content(parent.small_still_image_asset),
    },
    MemberGroup: {
        id: (parent) => parent.id,
        name: (parent) => ({ jp: parent.name_jp, en: parent.name_en }),
        logo: (parent) => content(parent.logo_image_asset),
        logo_white: (parent) => content(parent.logo_white_image_asset),
        color: (parent) => parent.color,
    },
    MemberGroupID: {
        MUSE: "muse",
        AQOURS: "aqours",
        NIJIGASAKI: "nijigasaki",
    },
    MemberUnit: {
        id: (parent) => parent.id,
        name: (parent) => ({ jp: parent.name_jp, en: parent.name_en }),
        logo: (parent) => content(parent.logo_image_asset),
    },
    MemberUnitID: {
        PRINTEMPS: "printemps",
        BIBI: "bibi",
        LILY_WHITE: "lilywhite",
        CYARON: "cyaron",
        AZALEA: "azalea",
        GUILTY_KISS: "guiltykiss",
        AZUNA: "azuna",
        DIVER_DIVA: "diverdiva",
        QU4RTZ: "qu4rtz",
    },
};
