const { gql } = require("apollo-server-cloud-functions");
const { content } = require("../../util/datahandler");

exports.typeDefs = gql`
    type Card {
        "Internal ID of the card"
        id: Int!
        "Unique incrementing number for the card, usually in release order"
        no: Int!
        rarity: CardRarity!
        attribute: Attribute!
        role: CardRole!
        member: Member!
        "Appearance info, idolized + unidolized images, names, etc"
        appearance: CardAppearances!
        "All outfits linked to the card"
        outfits: [CardOutfit]!
        skills: CardSkills!
        "True if the card is on the WW version"
        is_on_global: Boolean!
        "Max number of inspiration slots this card can have"
        inspiration_slots: Int!
        "True if this card is a 'FES' UR"
        is_fes: Boolean!
        "Where this card came from"
        card_type: CardObtainType!
    }

    enum CardRarityID {
        UR
        SR
        R
    }

    type CardRarity {
        id: CardRarityID!
        name: String!
        icon: String!
    }

    enum CardRoleID {
        VO
        SK
        SP
        GD
    }

    type CardRole {
        id: CardRoleID!
        name: String!
        icon: String!
    }

    type CardAppearances {
        unidolized: CardAppearance!
        idolized: CardAppearance!
    }

    type CardAppearance {
        "The card's displayed name"
        name: LocalizedString!
        "Full high quality image of the card"
        full_image: String!
        "Smaller size of the full_image"
        small_image: String!
        "Card icon with border and attribute + role"
        icon: String!
        "Card icon without the border"
        icon_thumbnail: String!
        "Vertically sized image for team screen"
        deck_thumbnail: String!
    }

    type CardOutfit {
        id: Int!
        name: LocalizedString!
        thumbnail: String!
    }

    enum CardObtainType {
        INITIAL
        FES
        PICKUP
        EVENT_GACHA
        EVENT_REWARD
    }

    type CardSkills {
        actives: [CardActiveSkill]!
        passives: [CardPassiveSkill]!
    }

    "An 'Active' skill, or one that activates on tap"
    type CardActiveSkill {
        "Leveled information for the skill's effects"
        abilities: [LeveledAbility]!
        "Raw IDs for each level of the skill"
        skill_ids: [Int]!
        "In-game skill name, the uniquely named card-specific one"
        name: LocalizedString!
        "In-game skill description, describes the effect briefly"
        description: LocalizedString!
        "Effect thumbnail image"
        thumbnail: String!
        "Amount of SP gauge this fills when activating (I had no idea this was a thing?)"
        sp_gauge: Int!
        "Base chance to activate on tap"
        base_chance: Float!
    }

    "A 'Passive' skill, one that is either triggered or always active"
    type CardPassiveSkill {
        "Leveled information for the skill's effects"
        abilities: [LeveledAbility]!
        "Raw IDs for each level of the skill"
        skill_ids: [Int]!
        "In-game skill name, shortened effect description"
        name: LocalizedString!
        "In-game skill description, describes the effect briefly"
        description: LocalizedString!
        "Effect thumbnail image"
        thumbnail: String!
    }
`;

const skillsToLeveledAbilities = (skills) => {
    let ret = [];
    for (let i = 0; i < skills[0].effects.length; i++) {
        let levels = skills.map((skill) => skill.effects[i]);
        ret.push({
            levels,
        });
    }
    return ret;
};

exports.resolvers = {
    Card: {
        id: (parent) => parent.card_id,
        no: (parent) => parent.no,
        rarity: (parent) => parent.rarity,
        attribute: (parent) => parent.attribute,
        role: (parent) => parent.role,
        member: (parent) => parent.member,
        appearance: (parent) => parent.appearance,
        outfits: (parent) => parent.outfits,
        skills: (parent) => parent.skills,
        is_on_global: (parent) => parent.is_on_global,
        inspiration_slots: (parent) => parent.inspiration_slots,
        is_fes: (parent) => parent.is_fes,
        card_type: (parent) => parent.card_type,
    },
    CardRarity: {
        id: (parent) => parent.id,
        name: (parent) => parent.id.toUpperCase(),
        icon: (parent) => content(parent.ui_image_asset),
    },
    CardRarityID: {
        UR: "ur",
        SR: "sr",
        R: "r",
    },
    CardRole: {
        id: (parent) => parent.id,
        name: (parent) =>
            parent.id.charAt(0).toUpperCase() +
            parent.id.substr(1).toLowerCase(),
        icon: (parent) => content(parent.ui_image_asset),
    },
    CardRoleID: {
        VO: "vo",
        SK: "sk",
        SP: "sp",
        GD: "gd",
    },
    CardAppearances: {
        idolized: (parent) => parent.idolized,
        unidolized: (parent) => parent.unidolized,
    },
    CardAppearance: {
        name: (parent) => ({ jp: parent.name_jp, en: parent.name_en }),
        full_image: (parent) => content(parent.full_image_asset),
        small_image: (parent) => content(parent.small_image_asset),
        icon: (parent) => content(parent.icon_image_asset),
        icon_thumbnail: (parent) => content(parent.thumbnail_image_asset),
        deck_thumbnail: (parent) => content(parent.deck_thumbnail_image_asset),
    },
    CardOutfit: {
        id: (parent) => parent.outfit_id,
        name: (parent) => ({ jp: parent.name_jp, en: parent.name_en }),
        thumbnail: (parent) => content(parent.thumbnail_image_asset),
    },
    CardObtainType: {
        INITIAL: "initial",
        FES: "fes",
        PICKUP: "pickup",
        EVENT_GACHA: "event_gacha",
        EVENT_REWARD: "event_reward",
    },
    CardSkills: {
        actives: (parent) => parent.active,
        passives: (parent) => parent.passive,
    },
    CardActiveSkill: {
        abilities: (parent, args, context) => {
            let promises = parent.skill_ids.map((skill_id) =>
                context.dataSources.data.getObject("skills/active", skill_id)
            );
            return Promise.all(promises).then((objects) =>
                Promise.resolve(skillsToLeveledAbilities(objects))
            );
        },
        skill_ids: (parent) => parent.skill_ids,
        name: (parent) => ({ jp: parent.name_jp, en: parent.name_en }),
        description: (parent) => ({
            jp: parent.description_jp,
            en: parent.description_en,
        }),
        thumbnail: (parent) => content(parent.thumbnail_image_asset),
        sp_gauge: (parent) => parent.sp_gauge,
        base_chance: (parent) => parent.base_chance,
    },
    CardPassiveSkill: {
        abilities: (parent, args, context) => {
            var promises = parent.skill_ids.map((skill_id) =>
                context.dataSources.data.getObject("skills/passive", skill_id)
            );
            return Promise.all(promises).then((skills) =>
                Promise.resolve(skillsToLeveledAbilities(skills))
            );
        },
        skill_ids: (parent) => parent.skill_ids,
        name: (parent) => ({ jp: parent.name_jp, en: parent.name_en }),
        description: (parent) => ({
            jp: parent.description_jp,
            en: parent.description_en,
        }),
        thumbnail: (parent) => content(parent.thumbnail_image_asset),
    },
};
