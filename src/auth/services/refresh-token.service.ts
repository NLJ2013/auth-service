import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken } from '../models/refresh-token.model';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
  ) {}

  async saveRefreshToken(tokenData: Partial<RefreshToken>): Promise<void> {
    console.log('tokenData: ', tokenData);
    await this.refreshTokenModel.create(tokenData);
  }

  async findValidRefreshToken(
    userId: string,
    tokenHash: string,
  ): Promise<RefreshToken | null> {
    return this.refreshTokenModel.findOne({
      userId,
      tokenHash,
      revoked: false,
      expiresAt: { $gte: new Date() },
    });
  }

  async revokeRefreshToken(tokenId: string): Promise<void> {
    await this.refreshTokenModel.updateOne(
      { _id: tokenId },
      { $set: { revoked: true } },
    );
  }
}
