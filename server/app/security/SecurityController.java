package security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.collect.ImmutableMap;
import models.User;
import models.enums.UserType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.*;
import org.springframework.security.oauth2.provider.token.AuthorizationServerTokenServices;
import org.springframework.stereotype.Service;
import play.Logger;
import play.libs.F.Promise;
import play.libs.Json;
import play.mvc.BodyParser;
import play.mvc.Controller;
import play.mvc.Result;
import utils.JsonResult;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class SecurityController extends Controller {

  private Logger.ALogger logger = Logger.of("security");


  @Autowired
  private AuthenticationManager clientAuthenticationManager;

  @Autowired
  private ClientDetailsService clientDetailsService;

  @Autowired
  @Qualifier("oauth2TokenGranter")
  private TokenGranter tokenGranter;

  @Autowired
  private AuthorizationServerTokenServices tokenServices;

  @BodyParser.Of(BodyParser.Json.class)
  public Promise<Result> authenticateClient() {
    JsonNode json = request().body().asJson();
    String clientId = json.findPath("clientId").textValue();
    String clientSecret = json.findPath("clientSecret").textValue();

    UsernamePasswordAuthenticationToken authRequest =
        new UsernamePasswordAuthenticationToken(clientId, clientSecret);
    clientAuthenticationManager.authenticate(authRequest);

    ClientDetails clientDetails = clientDetailsService.loadClientByClientId(clientId);
    TokenRequest tokenRequest = new TokenRequest(Collections.emptyMap(), clientId,
        clientDetails.getScope(), "password");
    OAuth2AccessToken token = tokenGranter.grant("client_credentials", tokenRequest);

    ObjectNode result = Json.newObject();
    result.setAll(ImmutableMap.of(
        "accessToken", result.textNode(token.getValue()),
        "clientId", result.textNode(clientId),
        "expiration", result.numberNode(token.getExpiration().getTime())));
    return Promise.pure(ok(result));
  }

  @BodyParser.Of(BodyParser.Json.class)
  @PreAuthorize("#oauth2.clientHasRole('ROLE_CLIENT') and #oauth2.hasScope('trust')")
  public Promise<Result> authenticateUser() {
    JsonNode json = request().body().asJson();
    String username = json.findPath("username").textValue();
    String password = json.findPath("password").textValue();
    String phone = json.findPath("phone").textValue();

    // 判断用户合法性

    User user = User.findByUserNameAndPassword(username, password);

    if (user == null) {

      return Promise.pure(badRequest(new JsonResult("error", "Incorrect phone or password").toJsonResponse()));

    } else {

      //  保存最后登录ip
      user.setLastIp(request().remoteAddress());
      user.update();

      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

      OAuth2Request clientAuthenticationRequest =
              ((OAuth2Authentication) authentication).getOAuth2Request();

      Map<String, String> requestParameters = new HashMap<>();
      requestParameters.put("username", username);
      requestParameters.put("password", password);

      TokenRequest tokenRequest = new TokenRequest(requestParameters,
              clientAuthenticationRequest.getClientId(), clientAuthenticationRequest.getScope(),
              "password");

      OAuth2AccessToken token = tokenGranter.grant("password", tokenRequest);
      ObjectNode result = Json.newObject();

      result.setAll(ImmutableMap.of(
              "accessToken", result.textNode(token.getValue()),
              "username", result.textNode(username),
              "expiration", result.numberNode(token.getExpiration().getTime()),
              "refreshToken", result.textNode(token.getRefreshToken().getValue())));
      return Promise.pure(ok(result));
    }
  }

  @BodyParser.Of(BodyParser.Json.class)
  @PreAuthorize("#oauth2.clientHasRole('ROLE_CLIENT') and #oauth2.hasScope('trust')")
  public Promise<Result> refreshUserAccessToken() {
    JsonNode body = request().body().asJson();
    String refreshToken = body.findPath("refreshToken").textValue();

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    OAuth2Request clientAuthenticationRequest =
        ((OAuth2Authentication) authentication).getOAuth2Request();
    TokenRequest tokenRequest =
        new TokenRequest(Collections.emptyMap(), clientAuthenticationRequest.getClientId(),
            clientAuthenticationRequest.getScope(), "refresh");
    OAuth2AccessToken token = tokenServices.refreshAccessToken(refreshToken, tokenRequest);
    ObjectNode result = Json.newObject();
    result.setAll(ImmutableMap.of(
        "accessToken", result.textNode(token.getValue()),
        "expiration", result.numberNode(token.getExpiration().getTime()),
        "refreshToken", result.textNode(token.getRefreshToken().getValue())));
    return Promise.pure(ok(result));
  }
}
