import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, AlertTriangle, Coffee, Zap } from 'lucide-react';

interface MarketTimeInfo {
  currentTime: Date;
  marketProgress: number;
  currentMessage: string;
  messageType: 'pre-market' | 'opening' | 'morning' | 'lunch' | 'afternoon' | 'power-hour' | 'closing' | 'closed';
  timeUntilNext: string;
  isMarketOpen: boolean;
}

const StockMarketClock = () => {
  const [timeInfo, setTimeInfo] = useState<MarketTimeInfo | null>(null);

  const getMarketTimeInfo = (): MarketTimeInfo => {
    const now = new Date();
    
    // Convert to EST (UTC-5) or EDT (UTC-4) depending on DST
    const estOffset = -5; // EST offset from UTC
    const estTime = new Date(now.getTime() + (estOffset * 60 * 60 * 1000));
    
    const hours = estTime.getHours();
    const minutes = estTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    
    // Market times in minutes from midnight
    const preMarket = 9 * 60 + 15; // 9:15 AM
    const marketOpen = 9 * 60 + 30; // 9:30 AM
    const marketClose = 16 * 60; // 4:00 PM
    
    let marketProgress = 0;
    let currentMessage = '';
    let messageType: MarketTimeInfo['messageType'] = 'closed';
    let timeUntilNext = '';
    let isMarketOpen = false;

    if (totalMinutes < preMarket) {
      // Before pre-market
      const minutesUntilPreMarket = preMarket - totalMinutes;
      const hoursUntil = Math.floor(minutesUntilPreMarket / 60);
      const minsUntil = minutesUntilPreMarket % 60;
      timeUntilNext = `${hoursUntil}h ${minsUntil}m until pre-market`;
      currentMessage = 'Market Closed - Pre-market opens at 9:15 AM EST';
      messageType = 'closed';
    } else if (totalMinutes >= preMarket && totalMinutes < marketOpen) {
      // Pre-market (9:15 - 9:30)
      const minutesUntilOpen = marketOpen - totalMinutes;
      timeUntilNext = `${minutesUntilOpen} minutes until market open`;
      currentMessage = '15 minutes until market open - Prepare for trading';
      messageType = 'pre-market';
      marketProgress = ((totalMinutes - preMarket) / (marketClose - preMarket)) * 100;
    } else if (totalMinutes >= marketOpen && totalMinutes < marketClose) {
      // Market is open
      isMarketOpen = true;
      marketProgress = ((totalMinutes - preMarket) / (marketClose - preMarket)) * 100;
      
      if (totalMinutes < marketOpen + 5) {
        // First 5 minutes (9:30 - 9:35)
        currentMessage = 'Liquidity grab high volatility - Wait for market to steady';
        messageType = 'opening';
      } else if (totalMinutes < 10 * 60) {
        // Before 10 AM
        currentMessage = 'Market move incoming - Watch for reversal, pullback, consolidation, or continuation';
        messageType = 'morning';
      } else if (totalMinutes < 12 * 60) {
        // Before 12 PM (noon)
        currentMessage = 'Approaching lunch - Possible market slowdown and consolidation';
        messageType = 'morning';
      } else if (totalMinutes < 13 * 60 + 30) {
        // 12 PM - 1:30 PM
        currentMessage = 'Lunch ending - A move might occur between now and 1:30 PM';
        messageType = 'lunch';
      } else if (totalMinutes < 15 * 60) {
        // 1:30 PM - 3:00 PM
        currentMessage = 'Afternoon session - Monitor for trend continuation';
        messageType = 'afternoon';
      } else if (totalMinutes < 15 * 60 + 45) {
        // 3:00 PM - 3:45 PM
        currentMessage = 'Power Hour - Increased volume and volatility expected';
        messageType = 'power-hour';
      } else {
        // 3:45 PM - 4:00 PM
        currentMessage = '15 minute warning for market close - Final moves incoming';
        messageType = 'closing';
      }
      
      const minutesUntilClose = marketClose - totalMinutes;
      const hoursUntil = Math.floor(minutesUntilClose / 60);
      const minsUntil = minutesUntilClose % 60;
      timeUntilNext = `${hoursUntil}h ${minsUntil}m until market close`;
    } else {
      // After market close
      currentMessage = 'Market Closed - Next session opens at 9:15 AM EST tomorrow';
      messageType = 'closed';
      timeUntilNext = 'Market closed for the day';
      marketProgress = 100;
    }

    return {
      currentTime: estTime,
      marketProgress: Math.max(0, Math.min(100, marketProgress)),
      currentMessage,
      messageType,
      timeUntilNext,
      isMarketOpen
    };
  };

  useEffect(() => {
    const updateTime = () => {
      setTimeInfo(getMarketTimeInfo());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const getMessageIcon = (type: MarketTimeInfo['messageType']) => {
    switch (type) {
      case 'pre-market':
      case 'opening':
        return <TrendingUp className="w-5 h-5" />;
      case 'morning':
      case 'afternoon':
        return <Clock className="w-5 h-5" />;
      case 'lunch':
        return <Coffee className="w-5 h-5" />;
      case 'power-hour':
        return <Zap className="w-5 h-5" />;
      case 'closing':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getMessageVariant = (type: MarketTimeInfo['messageType']) => {
    switch (type) {
      case 'pre-market':
        return 'secondary';
      case 'opening':
      case 'power-hour':
        return 'destructive';
      case 'closing':
        return 'destructive';
      case 'lunch':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (!timeInfo) return null;

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Card className="bg-gradient-wood border-2 border-bronze shadow-trading p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground tracking-wide">
              MARKET TIMELINE
            </h1>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-2xl font-mono text-gold">
                {timeInfo.currentTime.toLocaleTimeString('en-US', {
                  timeZone: 'America/New_York',
                  hour12: true,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })} EST
              </div>
              <Badge 
                variant={timeInfo.isMarketOpen ? "default" : "secondary"} 
                className={timeInfo.isMarketOpen ? "bg-success text-success-foreground" : ""}
              >
                {timeInfo.isMarketOpen ? 'MARKET OPEN' : 'MARKET CLOSED'}
              </Badge>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Time markers */}
            <div className="flex justify-between mb-4">
              {['9:15', '9:30', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00'].map((time) => (
                <div key={time} className="text-center">
                  <div className="text-sm text-muted-foreground font-mono">{time}</div>
                  <div className="w-px h-6 bg-border mx-auto mt-1"></div>
                </div>
              ))}
            </div>

            {/* Progress bar background */}
            <div className="relative h-8 bg-wood-dark rounded-full border-2 border-bronze overflow-hidden">
              {/* Progress fill */}
              <div 
                className="h-full bg-gradient-progress transition-all duration-1000 ease-out relative"
                style={{ width: `${timeInfo.marketProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/20 to-transparent animate-pulse-glow"></div>
              </div>
              
              {/* Current time indicator */}
              <div 
                className="absolute top-0 w-1 h-full bg-gold shadow-glow transition-all duration-1000"
                style={{ left: `${timeInfo.marketProgress}%` }}
              >
                <div className="absolute -top-2 -left-2 w-5 h-5 bg-gold rounded-full shadow-glow animate-pulse-glow"></div>
              </div>
            </div>

            {/* Session labels */}
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">PRE-MARKET</span>
              <span className="text-xs text-muted-foreground">MORNING</span>
              <span className="text-xs text-muted-foreground">LUNCH</span>
              <span className="text-xs text-muted-foreground">AFTERNOON</span>
              <span className="text-xs text-muted-foreground">POWER HOUR</span>
            </div>
          </div>

          {/* Current message */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              {getMessageIcon(timeInfo.messageType)}
              <Badge variant={getMessageVariant(timeInfo.messageType)} className="text-lg px-4 py-2">
                {timeInfo.messageType.toUpperCase().replace('-', ' ')}
              </Badge>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 animate-slide-in">
              <p className="text-xl text-foreground font-medium text-center">
                {timeInfo.currentMessage}
              </p>
              <p className="text-muted-foreground mt-2 text-center">
                {timeInfo.timeUntilNext}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StockMarketClock;