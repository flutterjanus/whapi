import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';


class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition as any);
    this.core = new APICore(this.spec as any, 'whapi-partner/0.1.1 (api/6.1.2)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * ✅ Create channel
   *
   * @throws FetchError<400, types.CreateChannelResponse400> Wrong request parameters
   * @throws FetchError<404, types.CreateChannelResponse404> Specified project not found
   * @throws FetchError<500, types.CreateChannelResponse500> Internal Error
   * @throws FetchError<503, types.CreateChannelResponse503> All servers are currently busy. Please try again later
   */
  createChannel(body: types.CreateChannelBodyParam): Promise<FetchResponse<200, types.CreateChannelResponse200>> {
    return this.core.fetch('/channels', 'put', body);
  }

  /**
   * Get channels
   *
   * @throws FetchError<400, types.GetChannelsResponse400> Wrong request parameters
   * @throws FetchError<500, types.GetChannelsResponse500> Internal Error
   */
  getChannels(metadata?: types.GetChannelsMetadataParam): Promise<FetchResponse<200, types.GetChannelsResponse200>> {
    return this.core.fetch('/channels/list', 'get', metadata);
  }

  /**
   * Get channels
   *
   * @throws FetchError<400, types.GetChannelsByProjectIdResponse400> Wrong request parameters
   * @throws FetchError<404, types.GetChannelsByProjectIdResponse404> Specified project not found
   * @throws FetchError<500, types.GetChannelsByProjectIdResponse500> Internal Error
   */
  getChannelsByProjectID(metadata: types.GetChannelsByProjectIdMetadataParam): Promise<FetchResponse<200, types.GetChannelsByProjectIdResponse200>> {
    return this.core.fetch('/channels/list/{ProjectID}', 'get', metadata);
  }

  /**
   * Get channel
   *
   * @throws FetchError<400, types.GetChannelResponse400> Wrong request parameters
   * @throws FetchError<404, types.GetChannelResponse404> Specified channel not found
   * @throws FetchError<500, types.GetChannelResponse500> Internal Error
   */
  getChannel(metadata: types.GetChannelMetadataParam): Promise<FetchResponse<200, types.GetChannelResponse200>> {
    return this.core.fetch('/channels/{ChannelID}', 'get', metadata);
  }

  /**
   * ❌ Delete channel
   *
   * @throws FetchError<400, types.DeleteChannelResponse400> Wrong request parameters
   * @throws FetchError<404, types.DeleteChannelResponse404> Specified channel not found
   * @throws FetchError<500, types.DeleteChannelResponse500> Internal Error
   */
  deleteChannel(metadata: types.DeleteChannelMetadataParam): Promise<FetchResponse<200, types.DeleteChannelResponse200>> {
    return this.core.fetch('/channels/{ChannelID}', 'delete', metadata);
  }

  /**
   * Update channel
   *
   * @throws FetchError<400, types.UpdateChannelResponse400> Wrong request parameters
   * @throws FetchError<404, types.UpdateChannelResponse404> Specified channel not found
   * @throws FetchError<500, types.UpdateChannelResponse500> Internal Error
   */
  updateChannel(body: types.UpdateChannelBodyParam, metadata: types.UpdateChannelMetadataParam): Promise<FetchResponse<200, types.UpdateChannelResponse200>> {
    return this.core.fetch('/channels/{ChannelID}', 'patch', body, metadata);
  }

  /**
   * ▶ Start channel
   *
   * @throws FetchError<400, types.StartChannelResponse400> Wrong request parameters
   * @throws FetchError<404, types.StartChannelResponse404> Specified channel not found
   * @throws FetchError<500, types.StartChannelResponse500> Internal Error
   * @throws FetchError<503, types.StartChannelResponse503> The channel is not ready to be started
   */
  startChannel(metadata: types.StartChannelMetadataParam): Promise<FetchResponse<200, types.StartChannelResponse200>> {
    return this.core.fetch('/channels/{ChannelID}/start', 'post', metadata);
  }

  /**
   * ⏹ Stop channel
   *
   * @throws FetchError<400, types.StopChannelResponse400> Wrong request parameters
   * @throws FetchError<404, types.StopChannelResponse404> Specified channel not found
   * @throws FetchError<500, types.StopChannelResponse500> Internal Error
   * @throws FetchError<503, types.StopChannelResponse503> The channel is not ready to be stopped
   */
  stopChannel(body: types.StopChannelBodyParam, metadata: types.StopChannelMetadataParam): Promise<FetchResponse<200, types.StopChannelResponse200>>;
  stopChannel(metadata: types.StopChannelMetadataParam): Promise<FetchResponse<200, types.StopChannelResponse200>>;
  stopChannel(body?: types.StopChannelBodyParam | types.StopChannelMetadataParam, metadata?: types.StopChannelMetadataParam): Promise<FetchResponse<200, types.StopChannelResponse200>> {
    return this.core.fetch('/channels/{ChannelID}/stop', 'post', body, metadata);
  }

  /**
   * 🔄 Restart channel
   *
   * @throws FetchError<400, types.RestartChannelResponse400> Wrong request parameters
   * @throws FetchError<404, types.RestartChannelResponse404> Specified channel not found
   * @throws FetchError<500, types.RestartChannelResponse500> Internal Error
   * @throws FetchError<503, types.RestartChannelResponse503> The channel is not ready to be restarted
   */
  restartChannel(metadata: types.RestartChannelMetadataParam): Promise<FetchResponse<200, types.RestartChannelResponse200>> {
    return this.core.fetch('/channels/{ChannelID}/restart', 'post', metadata);
  }

  /**
   * Extend channel
   *
   * @throws FetchError<400, types.ExtendChannelResponse400> Wrong request parameters
   * @throws FetchError<404, types.ExtendChannelResponse404> Specified channel not found
   * @throws FetchError<500, types.ExtendChannelResponse500> Internal Error
   * @throws FetchError<503, types.ExtendChannelResponse503> Error
   */
  extendChannel(body: types.ExtendChannelBodyParam, metadata: types.ExtendChannelMetadataParam): Promise<FetchResponse<200, types.ExtendChannelResponse200>> {
    return this.core.fetch('/channels/{ChannelID}/extend', 'post', body, metadata);
  }

  /**
   * Change channel mode
   *
   * @throws FetchError<400, types.ChangeChannelModeResponse400> Wrong request parameters
   * @throws FetchError<403, types.ChangeChannelModeResponse403> Forbidden
   * @throws FetchError<404, types.ChangeChannelModeResponse404> Specified channel not found
   * @throws FetchError<500, types.ChangeChannelModeResponse500> Internal Error
   */
  changeChannelMode(body: types.ChangeChannelModeBodyParam, metadata: types.ChangeChannelModeMetadataParam): Promise<FetchResponse<200, types.ChangeChannelModeResponse200>>;
  changeChannelMode(metadata: types.ChangeChannelModeMetadataParam): Promise<FetchResponse<200, types.ChangeChannelModeResponse200>>;

  changeChannelMode(body?: types.ChangeChannelModeBodyParam | types.ChangeChannelModeMetadataParam, metadata?: types.ChangeChannelModeMetadataParam): Promise<FetchResponse<200, types.ChangeChannelModeResponse200>> {
    return this.core.fetch('/channels/{ChannelID}/mode', 'patch', body, metadata);
  }

  /**
   * Get projects
   *
   * @throws FetchError<400, types.GetProjectsResponse400> Wrong request parameters
   * @throws FetchError<500, types.GetProjectsResponse500> Internal Error
   */
  getProjects(metadata?: types.GetProjectsMetadataParam): Promise<FetchResponse<200, types.GetProjectsResponse200>> {
    return this.core.fetch('/projects', 'get', metadata);
  }

  /**
   * ✅ Create project
   *
   * @throws FetchError<400, types.CreateProjectResponse400> Wrong request parameters
   * @throws FetchError<500, types.CreateProjectResponse500> Internal Error
   */
  createProject(body: types.CreateProjectBodyParam): Promise<FetchResponse<200, types.CreateProjectResponse200>> {
    return this.core.fetch('/projects', 'put', body);
  }

  /**
   * Get project
   *
   * @throws FetchError<400, types.GetProjectResponse400> Wrong request parameters
   * @throws FetchError<404, types.GetProjectResponse404> Specified project not found
   * @throws FetchError<500, types.GetProjectResponse500> Internal Error
   */
  getProject(metadata: types.GetProjectMetadataParam): Promise<FetchResponse<200, types.GetProjectResponse200>> {
    return this.core.fetch('/projects/{ProjectID}', 'get', metadata);
  }

  /**
   * ❌ Delete project
   *
   * @throws FetchError<400, types.DeleteProjectResponse400> Wrong request parameters
   * @throws FetchError<404, types.DeleteProjectResponse404> Specified project not found
   * @throws FetchError<500, types.DeleteProjectResponse500> Internal Error
   */
  deleteProject(metadata: types.DeleteProjectMetadataParam): Promise<FetchResponse<200, types.DeleteProjectResponse200>> {
    return this.core.fetch('/projects/{ProjectID}', 'delete', metadata);
  }

  /**
   * Update project
   *
   * @throws FetchError<400, types.UpdateProjectResponse400> Wrong request parameters
   * @throws FetchError<404, types.UpdateProjectResponse404> Specified project not found
   * @throws FetchError<500, types.UpdateProjectResponse500> Internal Error
   */
  updateProject(body: types.UpdateProjectBodyParam, metadata: types.UpdateProjectMetadataParam): Promise<FetchResponse<200, types.UpdateProjectResponse200>> {
    return this.core.fetch('/projects/{ProjectID}', 'patch', body, metadata);
  }

  /**
   * Get partner info
   *
   * @throws FetchError<400, types.GetPartnerResponse400> Wrong request parameters
   * @throws FetchError<404, types.GetPartnerResponse404> Specified partner not found
   * @throws FetchError<500, types.GetPartnerResponse500> Internal Error
   */
  getPartner(): Promise<FetchResponse<200, types.GetPartnerResponse200>> {
    return this.core.fetch('/partners', 'get');
  }

  /**
   * Get partner settings
   *
   * @throws FetchError<400, types.GetPartnerSettingsResponse400> Wrong request parameters
   * @throws FetchError<403, types.GetPartnerSettingsResponse403> Forbidden
   * @throws FetchError<500, types.GetPartnerSettingsResponse500> Internal Error
   */
  getPartnerSettings(metadata: types.GetPartnerSettingsMetadataParam): Promise<FetchResponse<200, types.GetPartnerSettingsResponse200>> {
    return this.core.fetch('/partners/{PartnerName}/settings', 'get', metadata);
  }

  /**
   * Set partner settings
   *
   * @throws FetchError<400, types.SetPartnerSettingsResponse400> Wrong request parameters
   * @throws FetchError<403, types.SetPartnerSettingsResponse403> Forbidden
   * @throws FetchError<500, types.SetPartnerSettingsResponse500> Internal Error
   */
  setPartnerSettings(body: types.SetPartnerSettingsBodyParam, metadata: types.SetPartnerSettingsMetadataParam): Promise<FetchResponse<200, types.SetPartnerSettingsResponse200>>;
  setPartnerSettings(metadata: types.SetPartnerSettingsMetadataParam): Promise<FetchResponse<200, types.SetPartnerSettingsResponse200>>;
  setPartnerSettings(body?: types.SetPartnerSettingsBodyParam | types.SetPartnerSettingsMetadataParam, metadata?: types.SetPartnerSettingsMetadataParam): Promise<FetchResponse<200, types.SetPartnerSettingsResponse200>> {
    return this.core.fetch('/partners/{PartnerName}/settings', 'patch', body, metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
  ;

export default createSDK;

export type { ChangeChannelModeBodyParam, ChangeChannelModeMetadataParam, ChangeChannelModeResponse200, ChangeChannelModeResponse400, ChangeChannelModeResponse403, ChangeChannelModeResponse404, ChangeChannelModeResponse500, CreateChannelBodyParam, CreateChannelResponse200, CreateChannelResponse400, CreateChannelResponse404, CreateChannelResponse500, CreateChannelResponse503, CreateProjectBodyParam, CreateProjectResponse200, CreateProjectResponse400, CreateProjectResponse500, DeleteChannelMetadataParam, DeleteChannelResponse200, DeleteChannelResponse400, DeleteChannelResponse404, DeleteChannelResponse500, DeleteProjectMetadataParam, DeleteProjectResponse200, DeleteProjectResponse400, DeleteProjectResponse404, DeleteProjectResponse500, ExtendChannelBodyParam, ExtendChannelMetadataParam, ExtendChannelResponse200, ExtendChannelResponse400, ExtendChannelResponse404, ExtendChannelResponse500, ExtendChannelResponse503, GetChannelMetadataParam, GetChannelResponse200, GetChannelResponse400, GetChannelResponse404, GetChannelResponse500, GetChannelsByProjectIdMetadataParam, GetChannelsByProjectIdResponse200, GetChannelsByProjectIdResponse400, GetChannelsByProjectIdResponse404, GetChannelsByProjectIdResponse500, GetChannelsMetadataParam, GetChannelsResponse200, GetChannelsResponse400, GetChannelsResponse500, GetPartnerResponse200, GetPartnerResponse400, GetPartnerResponse404, GetPartnerResponse500, GetPartnerSettingsMetadataParam, GetPartnerSettingsResponse200, GetPartnerSettingsResponse400, GetPartnerSettingsResponse403, GetPartnerSettingsResponse500, GetProjectMetadataParam, GetProjectResponse200, GetProjectResponse400, GetProjectResponse404, GetProjectResponse500, GetProjectsMetadataParam, GetProjectsResponse200, GetProjectsResponse400, GetProjectsResponse500, RestartChannelMetadataParam, RestartChannelResponse200, RestartChannelResponse400, RestartChannelResponse404, RestartChannelResponse500, RestartChannelResponse503, SetPartnerSettingsBodyParam, SetPartnerSettingsMetadataParam, SetPartnerSettingsResponse200, SetPartnerSettingsResponse400, SetPartnerSettingsResponse403, SetPartnerSettingsResponse500, StartChannelMetadataParam, StartChannelResponse200, StartChannelResponse400, StartChannelResponse404, StartChannelResponse500, StartChannelResponse503, StopChannelBodyParam, StopChannelMetadataParam, StopChannelResponse200, StopChannelResponse400, StopChannelResponse404, StopChannelResponse500, StopChannelResponse503, UpdateChannelBodyParam, UpdateChannelMetadataParam, UpdateChannelResponse200, UpdateChannelResponse400, UpdateChannelResponse404, UpdateChannelResponse500, UpdateProjectBodyParam, UpdateProjectMetadataParam, UpdateProjectResponse200, UpdateProjectResponse400, UpdateProjectResponse404, UpdateProjectResponse500 } from './types';
