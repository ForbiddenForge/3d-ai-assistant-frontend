import UAParser from 'ua-parser-js';
import { useState } from 'react';

// helper to determine if user is a filthy iOS user
export const isAppleUser = () => {
	const userAgent = navigator.userAgent;
	const parser = new UAParser(userAgent);
	const userSystem = parser.getOS().name;
	return userSystem === 'iOS' || userSystem === 'Mac OS';
};

export const CONFIG = {
	voice: 'openai_tts',
	voice_gender: 'male',
	prompt: 'forbiddenforge_prompt',
	isAppleDevice: isAppleUser(),
};
