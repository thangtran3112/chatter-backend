import { Types } from 'mongoose';

/**
 * FYI: https://github.com/davidyaha/graphql-redis-subscriptions?tab=readme-ov-file#using-a-custom-reviver
 * This function will help Redis Pubsub deserialize the Date and ObjectId properly
 */
export const reviver = (key, value) => {
  const isISO8601Z =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;
  if (typeof value === 'string' && isISO8601Z.test(value)) {
    const tempDateNumber = Date.parse(value);
    if (!isNaN(tempDateNumber)) {
      return new Date(tempDateNumber);
    }
  }
  if (key === '_id') {
    //could use Types.ObjectId.createFromHexString(key) to avoid deprecation
    return new Types.ObjectId(value);
  }
  return value;
};
