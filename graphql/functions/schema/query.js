const { gql } = require("apollo-server-cloud-functions");

exports.typeDefs = gql`
    type Query {
        card(id: Int, no: Int): Card
        cards(limit: Int, offset: Int): [Card]
        cardcount: Int
    }
`;

exports.resolvers = {
    Query: {
        card: async (parent, args, context) => {
            const cardData = await context.dataSources.data.getObject("cards");
            if (args.id) {
                return cardData[args.id + ""];
            } else if (args.no) {
                return Object.values(cardData).find((c) => c.no == args.no);
            }
            return null;
        },
        cards: async (parent, args, context) => {
            const cardData = await context.dataSources.data.getObject("cards");
            var cardList = Object.values(cardData).sort((a, b) => a.no - b.no);
            var offset = args.offset || 0;
            var limit = args.limit || -1;
            return cardList.slice(
                offset,
                limit > 0 ? offset + limit : undefined
            );
        },
        cardcount: async (parent, args, context) => {
            const cardData = await context.dataSources.data.getObject("cards");
            return Object.keys(cardData).length;
        },
    },
};
