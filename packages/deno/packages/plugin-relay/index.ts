// @ts-nocheck
import './global-types.ts';
import './field-builder.ts';
import './input-field-builder.ts';
import './schema-builder.ts';
import { GraphQLFieldResolver } from 'https://cdn.skypack.dev/graphql?dts';
import SchemaBuilder, { BasePlugin, createInputValueMapper, mapInputFields, PothosOutputFieldConfig, SchemaTypes, } from '../core/index.ts';
import { internalDecodeGlobalID } from './utils/internal.ts';
export * from './types.ts';
export * from './utils/index.ts';
const pluginName = "relay";
export default pluginName;
export class PothosRelayPlugin<Types extends SchemaTypes> extends BasePlugin<Types> {
    override wrapResolve(resolver: GraphQLFieldResolver<unknown, Types["Context"], object>, fieldConfig: PothosOutputFieldConfig<Types>): GraphQLFieldResolver<unknown, Types["Context"], object> {
        const argMappings = mapInputFields(fieldConfig.args, this.buildCache, (inputField) => {
            if (inputField.extensions?.isRelayGlobalID) {
                return true;
            }
            return null;
        });
        if (!argMappings) {
            return resolver;
        }
        const argMapper = createInputValueMapper(argMappings, (globalID, mappings, ctx: Types["Context"]) => internalDecodeGlobalID(this.builder, String(globalID), ctx));
        return (parent, args, context, info) => resolver(parent, argMapper(args, undefined, context), context, info);
    }
    override wrapSubscribe(subscribe: GraphQLFieldResolver<unknown, Types["Context"], object> | undefined, fieldConfig: PothosOutputFieldConfig<Types>): GraphQLFieldResolver<unknown, Types["Context"], object> | undefined {
        const argMappings = mapInputFields(fieldConfig.args, this.buildCache, (inputField) => {
            if (inputField.extensions?.isRelayGlobalID) {
                return true;
            }
            return null;
        });
        if (!argMappings || !subscribe) {
            return subscribe;
        }
        const argMapper = createInputValueMapper(argMappings, (globalID, mappings, ctx: Types["Context"]) => internalDecodeGlobalID(this.builder, String(globalID), ctx));
        return (parent, args, context, info) => subscribe(parent, argMapper(args, undefined, context), context, info);
    }
}
SchemaBuilder.registerPlugin(pluginName, PothosRelayPlugin);
