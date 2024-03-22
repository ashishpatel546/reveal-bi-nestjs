import { Injectable } from '@nestjs/common';

@Injectable()
export class ThrottlerService {
    private readonly requestCounts: Map<string, number> = new Map();


    isThrottled(identifier: string): boolean {
      console.log(this.requestCounts)
        const throttleData = this.requestCounts.get(identifier);
        if (!throttleData) return false;
        return true
      }
    
      // Method to delete entry for IP 
      deleteEntry(identifier: string): void {
        this.requestCounts.delete(identifier);
      }

      addEntry(identifier: string){
        this.requestCounts.set(identifier, 1)
      }
}
