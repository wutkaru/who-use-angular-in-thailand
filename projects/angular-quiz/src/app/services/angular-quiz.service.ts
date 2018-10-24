import { QuizCard } from './../models/quiz.model';
import { map, shareReplay } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TwitterSearchResponse } from '../models/twitter.model';

@Injectable({
  providedIn: 'root'
})
export class AngularQuizService {

  constructor(private httpClient: HttpClient) { }
  getAllScores() {
    const fromObject = { q: '#angularth-quiz', result_type: 'mixed', maximum: '100' };
    const params = new HttpParams({ fromObject });
    const headers = new HttpHeaders({
      'Authorization': `OAuth oauth_consumer_key="consumer-key-for-app",
        oauth_nonce="generated-nonce", oauth_signature="generated-signature",
        oauth_signature_method="HMAC-SHA1", oauth_timestamp="generated-timestamp",
        oauth_token="access-token-for-authed-user", oauth_version="1.0"`
    });
    const options = { headers, params };
    return this.httpClient.get<TwitterSearchResponse>('https://api.twitter.com/1.1/search/tweets.json', options )
    .pipe(
      map(twitter => {
        return twitter.statuses
          .filter(status => !status.retweeted)
          .map(status => ({
            name: status.user.screen_name,
            profileImg: status.user.profile_image_url_https,
            date: status.created_at,
            img: status.entities.urls[0].url,
            tweet: status.text,
            url: status.entities.urls[0].url,
          }) as QuizCard);
      }),
      shareReplay(1)
    );
  }
}
