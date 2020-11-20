const { gql } = require("apollo-server-cloud-functions");
const { content } = require("../../util/datahandler");

exports.typeDefs = gql`
    type ActiveSkill {
        id: Int!
        "Skill icon's 'rarity'"
        rarity: Int!
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
        "This skill's ability effects"
        abilities: [SkillAbility]!
    }

    type PassiveSkill {
        id: Int!
        "Skill icon's 'rarity'"
        rarity: Int!
        "In-game skill name, shortened effect description"
        name: LocalizedString!
        "In-game skill description, describes the effect briefly"
        description: LocalizedString!
        "Effect thumbnail image"
        thumbnail: String!
        "This skill's ability effects"
        abilities: [SkillAbility]!
    }

    type LeveledAbility {
        "A version of this ability, to apply formatting or see effect information. Values should be ignored here."
        base_ability: SkillAbility!
        "Leveled effect values, in order of level"
        effect_values: [Float]!
        "Leveled effect 'until' values, in order of level. Empty if not needed."
        effect_until_values: [Float]
        "Leveled trigger values, in order of level. Empty if not needed."
        trigger_values: [Float]
        "Leveled trigger chance values, in order of level. Empty if not needed."
        trigger_chances: [Float]
        "Formatted effect display, with each level included if the ability scales"
        effect_level_display: String!
        "Formatted trigger display, with level info included if scaling. Null if skill doesn't have a trigger."
        trigger_level_display: String
        "Formatted target display. Null if skill doesn't have a target."
        target_display: String
    }

    type SkillAbility {
        "The skill's effect, or what it does when it activates"
        effect: SkillEffect!
        "The trigger information, or what causes the effect to activate. Null if skill isn't triggered."
        trigger: SkillTrigger
        "The target information, or what the skill targets. Null if skill isn't targeted."
        target: SkillTarget
        "Abbreviated display of the whole skill's effect"
        short_display: String!
    }

    enum SkillValueType {
        PERCENT
        FLAT
    }

    type SkillEffect {
        "Unique string version of the effect, there's a huge list and I'll add it later"
        type: String!
        "Relevant value for the effect if needed"
        value: Float
        "Type of the value, for formatting"
        value_type: SkillValueType
        "Formatted display of the effect"
        display: String!
        "Unformatted display for manual formatting"
        format_display: String!
        "Shortened display without numbers"
        short_display: String!
        "Skill 'until' information, or when it ends. Null if not needed."
        until: SkillEffectUntil
    }

    type SkillEffectUntil {
        "Unique string version of the 'until', there's a huge list and I'll add it later"
        type: String!
        "Relevant value for the 'until' if needed"
        value: Float
        "Type of the value, for formatting"
        value_type: SkillValueType
        "Formatted display of the 'until'"
        display: String!
        "Unformatted display for manual formatting"
        format_display: String!
        "Shortened display without numbers"
        short_display: String!
    }

    type SkillTrigger {
        "Unique string version of the trigger, there's a huge list and I'll add it later"
        on: String!
        "Relevant value for the trigger if needed"
        value: Float
        "Type of the value, for formatting"
        value_type: SkillValueType
        "Formatted display of the trigger"
        display: String!
        "Unformatted display for manual formatting"
        format_display: String!
        "Shortened display without numbers"
        short_display: String!
        "Base chance for the trigger to activate"
        trigger_chance: Float!
        "Number of times this can activate per live, 0 for no limit"
        limit: Int!
    }

    type SkillTarget {
        "Formatted display of the target"
        display: String!
        "Unique string version of the target type"
        check: String!
        "True if this doesn't affect the 'owner' of the effect"
        excludes_self: Boolean!
        "The unique value(s) of the target 'check', comma-separated if there are multiple"
        value: String
    }
`;

const formatSkillValue = (value, type) => {
    if (type === "percent") {
        return value.toLocaleString("en-US", {
            style: "percent",
            maximumFractionDigits: 1,
        });
    }
    return value;
};

const unique = (value, index, self) => {
    return self.indexOf(value) === index;
};

const limitString = (limit) => {
    const vals = {
        1: "once",
        2: "twice",
        3: "three times",
        4: "four times",
        5: "five times",
        6: "six times",
        7: "seven times",
        8: "eight times",
        9: "nine times",
        10: "ten times",
    };
    if (limit in vals) return vals[limit];
    return null;
};

exports.resolvers = {
    ActiveSkill: {
        id: (parent) => parent.skill_id,
        rarity: (parent) => parent.skill_rarity,
        name: (parent) => ({ jp: parent.name_jp, en: parent.name_en }),
        description: (parent) => ({
            jp: parent.description_jp,
            en: parent.description_en,
        }),
        thumbnail: (parent) => content(parent.thumbnail_image_asset),
        sp_gauge: (parent) => parent.sp_gauge,
        base_chance: (parent) => parent.base_chance,
        abilities: (parent) => parent.effects,
    },
    PassiveSkill: {
        id: (parent) => parent.skill_id,
        rarity: (parent) => parent.skill_rarity,
        name: (parent) => ({ jp: parent.name_jp, en: parent.name_en }),
        description: (parent) => ({
            jp: parent.description_jp,
            en: parent.description_en,
        }),
        thumbnail: (parent) => content(parent.thumbnail_image_asset),
        abilities: (parent) => parent.effects,
    },
    LeveledAbility: {
        base_ability: (parent) => parent.levels[0],
        effect_values: (parent) =>
            parent.levels.map((skill) => skill.effect.value),
        effect_until_values: (parent) =>
            parent.levels
                .filter((skill) => skill.effect.until)
                .map((skill) => skill.effect.until.value),
        trigger_values: (parent) =>
            parent.levels
                .filter((skill) => skill.trigger)
                .map((skill) => skill.trigger.value),
        trigger_chances: (parent) =>
            parent.levels
                .filter((skill) => skill.trigger)
                .map((skill) => skill.trigger.trigger_chance),
        effect_level_display: (parent) => {
            let base = parent.levels[0];
            let base_format = base.effect.formatting;
            if (base.effect.until) {
                base_format += " " + base.effect.until.formatting;
            }

            let effect_vals = parent.levels
                .map((skill) =>
                    formatSkillValue(
                        skill.effect.value,
                        skill.effect.value_type
                    )
                )
                .filter(unique);
            let effect_format = effect_vals.join("/");
            if (effect_vals.length > 1) {
                effect_format = `[${effect_format}]`;
            }

            let until_format = "";
            if (base.effect.until) {
                let until_vals = parent.levels
                    .map((skill) =>
                        formatSkillValue(
                            skill.effect.until.value,
                            skill.effect.until.value_type
                        )
                    )
                    .filter(unique);
                until_format = until_vals.join("/");
                if (until_vals.length > 1) {
                    until_format = `[${until_format}]`;
                }
            }

            return base_format
                .replace("{effect}", effect_format)
                .replace("{until}", until_format);
        },
        trigger_level_display: (parent) => {
            let base = parent.levels[0];
            if (!base.trigger) return null;

            let base_format = base.trigger.formatting;
            if (base.trigger.trigger_chance < 1.0) {
                base_format += ", {trigger_chance} chance";
            }
            if (base.trigger.limit > 0) {
                base_format += ", {limit} per live";
            }

            let trigger_values = parent.levels
                .map((skill) =>
                    formatSkillValue(
                        skill.trigger.value,
                        skill.trigger.value_type
                    )
                )
                .filter(unique);
            let trigger_format = trigger_values.join("/");
            if (trigger_values.length > 1) {
                trigger_format = `[${trigger_format}]`;
            }

            let trigger_chances = parent.levels
                .map((skill) =>
                    formatSkillValue(skill.trigger.trigger_chance, "percent")
                )
                .filter(unique);
            let chance_format = trigger_chances.join("/");
            if (trigger_chances.length > 1) {
                chance_format = `[${chance_format}]`;
            }

            return base_format
                .replace("{limit}", limitString(base.trigger.limit))
                .replace("{trigger}", trigger_format)
                .replace("{trigger_chance}", chance_format);
        },
        target_display: (parent) =>
            parent.levels[0].target && parent.levels[0].target.display,
    },
    SkillAbility: {
        effect: (parent) => parent.effect,
        trigger: (parent) => parent.trigger,
        target: (parent) => parent.target,
        short_display: (parent) => parent.short_display,
    },
    SkillValueType: {
        PERCENT: "percent",
        FLAT: "value",
    },
    SkillEffect: {
        type: (parent) => parent.type,
        value: (parent) => parent.value,
        value_type: (parent) => parent.value_type,
        display: (parent) => parent.display,
        format_display: (parent) => parent.formatting,
        short_display: (parent) => parent.display_short,
        until: (parent) => parent.until,
    },
    SkillEffectUntil: {
        type: (parent) => parent.type,
        value: (parent) => parent.value,
        value_type: (parent) => parent.value_type,
        display: (parent) => parent.display,
        format_display: (parent) => parent.formatting,
        short_display: (parent) => parent.display_short,
    },
    SkillTrigger: {
        on: (parent) => parent.on,
        value: (parent) => parent.value,
        value_type: (parent) => parent.value_type,
        display: (parent) => parent.display,
        format_display: (parent) => parent.formatting,
        short_display: (parent) => parent.display_short,
        trigger_chance: (parent) => parent.trigger_chance,
        limit: (parent) => parent.limit,
    },
    SkillTarget: {
        display: (parent) => parent.display,
        check: (parent) => parent.check,
        excludes_self: (parent) => parent.excludes_self,
        value: (parent) => parent.value,
    },
};
