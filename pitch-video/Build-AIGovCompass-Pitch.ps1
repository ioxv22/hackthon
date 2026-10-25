[CmdletBinding()]
param([switch]$KeepBuildFiles)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$Base = Split-Path -Parent $MyInvocation.MyCommand.Path
$Screens = Join-Path $Base 'AIGovCompass_Pitch_Screenshots'
$Work = Join-Path $Base '.AIGovCompass-Pitch-Build'
$Ffmpeg = 'C:\Program Files\Wondershare\drfone\ffmpeg.exe'
$OutputVideo = Join-Path $Base 'AIGovCompass_PitchVideo_EN_1080p.mp4'
$OutputSrt = Join-Path $Base 'AIGovCompass_PitchVideo_EN.srt'
$OutputAss = Join-Path $Base 'AIGovCompass_PitchVideo_EN.ass'
$OutputVoice = Join-Path $Base 'AIGovCompass_Pitch_Voiceover.wav'
$OutputScript = Join-Path $Base 'AIGovCompass_Pitch_Voiceover.txt'
if (-not (Test-Path -LiteralPath $Ffmpeg)) { throw "FFmpeg was not found at $Ffmpeg" }
if (-not (Test-Path -LiteralPath $Screens)) { throw "Screenshot folder not found: $Screens" }
New-Item -ItemType Directory -Path $Work -Force | Out-Null

$Scenes = @(
  [pscustomobject]@{ Title='THE PROBLEM'; Target=25; Images=@('01-dashboard.png'); Lines=@(
    'Choosing an AI model for government use takes more than comparing answers.',
    'Teams must assess performance, security, privacy, and applicable requirements.',
    'When tests and supporting documents are scattered, evaluation becomes harder to coordinate, review, and repeat.'
  )},
  [pscustomobject]@{ Title='OUR SOLUTION'; Target=20; Images=@('02-use-case.png'); Lines=@(
    'AIGov Compass brings this process into one structured workflow.',
    'It helps government teams define their use case, compare model candidates, review evaluation evidence, and document a human decision.'
  )},
  [pscustomobject]@{ Title='THE USER JOURNEY'; Target=25; Images=@('03-registry.png','04-comparison.png'); Lines=@(
    'The journey starts with the intended use case and its requirements.',
    'Reviewers then compare candidates and inspect test results.',
    'Each result shows its evaluation method and limitations, helping reviewers understand what the evidence supports - and what still needs investigation.'
  )},
  [pscustomobject]@{ Title='THE EVIDENCE GATE'; Target=30; Images=@('06-blocked-evidence.png'); Lines=@(
    'Our key distinction is the evidence gate.',
    'Strong performance alone does not make a model ready for deployment.',
    'If a mandatory requirement lacks supporting evidence, approval is blocked.',
    'The platform explains the gap and the next action required.',
    'An authorized human reviewer remains responsible for the final decision.'
  )},
  [pscustomobject]@{ Title='DOCUMENT AND REASSESS'; Target=20; Images=@('10-model-passport.png','12-reassessment-required.png'); Lines=@(
    'The model passport records the evaluated use case, model information, results, evidence gaps, and reviewer decision.',
    'When the model version changes, the prototype requests reassessment while preserving the previous decision as a historical record.'
  )},
  [pscustomobject]@{ Title='VALUE AND NEXT STEPS'; Target=25; Images=@('13-time-measure.png','14-roadmap.png'); Lines=@(
    'We target an 80 percent reduction in evaluation time.',
    'This remains a goal to validate through equivalent manual and platform-assisted tasks, including human review.',
    'Our proposed 90-day roadmap covers requirement validation, a limited pilot, and improvements based on measured results.'
  )},
  [pscustomobject]@{ Title='AIGOV COMPASS'; Target=15; Images=@('01-dashboard.png'); Lines=@(
    'AIGov Compass: choose the right model, see the evidence, and keep humans in control.'
  )}
)

foreach ($scene in $Scenes) {
  foreach ($image in $scene.Images) {
    if (-not (Test-Path -LiteralPath (Join-Path $Screens $image))) { throw "Required screenshot missing: $image" }
  }
}

function Invoke-Ffmpeg {
  param([string[]]$Arguments)
  & $script:Ffmpeg @Arguments
  if ($LASTEXITCODE -ne 0) { throw "FFmpeg failed with exit code $LASTEXITCODE" }
}
function Get-WavDuration {
  param([string]$Path)
  $stream = [System.IO.File]::OpenRead($Path)
  $reader = New-Object System.IO.BinaryReader($stream)
  try {
    $stream.Position = 12
    $byteRate = 0
    $dataSize = 0
    while ($stream.Position + 8 -le $stream.Length) {
      $chunk = [System.Text.Encoding]::ASCII.GetString($reader.ReadBytes(4))
      $size = $reader.ReadUInt32()
      $chunkStart = $stream.Position
      if ($chunk -eq 'fmt ') {
        $reader.ReadUInt16() | Out-Null
        $reader.ReadUInt16() | Out-Null
        $reader.ReadUInt32() | Out-Null
        $byteRate = $reader.ReadUInt32()
      }
      elseif ($chunk -eq 'data') { $dataSize = $size; break }
      $stream.Position = $chunkStart + $size + ($size % 2)
    }
    if ($byteRate -le 0 -or $dataSize -le 0) { throw "Could not read WAV duration: $Path" }
    return [double]$dataSize / [double]$byteRate
  }
  finally { $reader.Dispose(); $stream.Dispose() }
}
function Format-AssTime {
  param([double]$Seconds)
  $ts = [TimeSpan]::FromSeconds([Math]::Max(0,$Seconds))
  $cs = [Math]::Floor($ts.Milliseconds / 10)
  return ('{0}:{1:00}:{2:00}.{3:00}' -f [Math]::Floor($ts.TotalHours),$ts.Minutes,$ts.Seconds,$cs)
}
function Format-SrtTime {
  param([double]$Seconds)
  $ms = [Math]::Floor([Math]::Max(0,$Seconds) * 1000)
  $hours = [Math]::Floor($ms / 3600000)
  $minutes = [Math]::Floor(($ms % 3600000) / 60000)
  $seconds = [Math]::Floor(($ms % 60000) / 1000)
  $millis = $ms % 1000
  return ('{0:00}:{1:00}:{2:00},{3:000}' -f $hours,$minutes,$seconds,$millis)
}
function Wrap-Caption {
  param([string]$Text,[int]$Width=76)
  $words = $Text -split '\s+'
  $lines = New-Object System.Collections.Generic.List[string]
  $line = ''
  foreach ($word in $words) {
    $candidate = if ($line) { "$line $word" } else { $word }
    if ($candidate.Length -gt $Width -and $line) { $lines.Add($line); $line = $word }
    else { $line = $candidate }
  }
  if ($line) { $lines.Add($line) }
  return ,$lines.ToArray()
}
function Write-Utf8 {
  param([string]$Path,[string]$Text)
  [System.IO.File]::WriteAllText($Path,$Text,(New-Object System.Text.UTF8Encoding($false)))
}
function New-Silence {
  param([double]$Duration,[string]$Name)
  if ($Duration -lt 0.04) { return $null }
  $durationText = $Duration.ToString('0.###',[Globalization.CultureInfo]::InvariantCulture)
  $silencePath = Join-Path $Work $Name
  Invoke-Ffmpeg @('-hide_banner','-loglevel','error','-y','-f','lavfi','-i','anullsrc=r=22050:cl=mono','-t',$durationText,'-c:a','pcm_s16le',$silencePath)
  return $Name
}

$script:Ffmpeg = $Ffmpeg
$voice = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
  $voice.SelectVoice('Microsoft Zira Desktop')
  $voice.Rate = -1
  $voice.Volume = 96
  $scriptLines = New-Object System.Collections.Generic.List[string]
  $subtitleEntries = New-Object System.Collections.Generic.List[object]
  $assEvents = New-Object System.Collections.Generic.List[string]
  $voiceFiles = New-Object System.Collections.Generic.List[string]
  $videoFiles = New-Object System.Collections.Generic.List[string]
  $globalTime = 0.0
  $sentenceGap = 0.22
  $sceneIndex = 0
  $subtitleIndex = 0

  foreach ($scene in $Scenes) {
    $sceneIndex++
    $sceneStart = $globalTime
    $scriptLines.Add($scene.Title)
    $sceneSentenceRecords = New-Object System.Collections.Generic.List[object]
    $sentenceIndex = 0
    foreach ($line in $scene.Lines) {
      $sentenceIndex++
      $wavName = ('tts_{0:00}_{1:00}.wav' -f $sceneIndex,$sentenceIndex)
      $wavPath = Join-Path $Work $wavName
      $voice.SetOutputToWaveFile($wavPath)
      $voice.Speak($line)
      $voice.SetOutputToNull()
      $duration = Get-WavDuration $wavPath
      $sceneSentenceRecords.Add([pscustomobject]@{ Text=$line; File=$wavName; Duration=$duration })
      $scriptLines.Add($line)
    }

    $speechLength = 0.0
    foreach ($record in $sceneSentenceRecords) { $speechLength += $record.Duration }
    $speechLength += $sentenceGap * [Math]::Max(0,$sceneSentenceRecords.Count - 1)
    $sceneDuration = [Math]::Max([double]$scene.Target,$speechLength + 1.0)
    if (($globalTime + $sceneDuration) -gt 180) { throw 'The generated narration would exceed the 3-minute delivery limit.' }
    $localTime = $sceneStart
    for ($i=0; $i -lt $sceneSentenceRecords.Count; $i++) {
      $record = $sceneSentenceRecords[$i]
      $voiceFiles.Add("file '$($record.File)'")
      $subtitleStart = $localTime
      $subtitleEnd = $subtitleStart + $record.Duration
      $wrapped = Wrap-Caption $record.Text
      $subtitleEntries.Add([pscustomobject]@{ Start=$subtitleStart; End=$subtitleEnd; Lines=$wrapped })
      $subtitleIndex++
      $localTime += $record.Duration
      if ($i -lt ($sceneSentenceRecords.Count - 1)) {
        $gapName = ('pause_{0:00}.wav' -f $sceneIndex)
        if (-not (Test-Path -LiteralPath (Join-Path $Work $gapName))) { New-Silence $sentenceGap $gapName | Out-Null }
        $voiceFiles.Add("file '$gapName'")
        $localTime += $sentenceGap
      }
    }

    $sceneEnd = $sceneStart + $sceneDuration
    $assEvents.Add("Dialogue: 0,$(Format-AssTime $sceneStart),$(Format-AssTime $sceneEnd),Title,,0,0,0,,$($scene.Title)")
    $assEvents.Add("Dialogue: 0,$(Format-AssTime $sceneStart),$(Format-AssTime $sceneEnd),Stamp,,0,0,0,,PROTOTYPE - SIMULATED DATA AND RESULTS")
    $tailDuration = $sceneEnd - $localTime
    if ($tailDuration -gt 0.04) {
      $tailName = ('tail_{0:00}.wav' -f $sceneIndex)
      New-Silence $tailDuration $tailName | Out-Null
      $voiceFiles.Add("file '$tailName'")
    }

    $imageDuration = $sceneDuration / $scene.Images.Count
    for ($imageIndex=0; $imageIndex -lt $scene.Images.Count; $imageIndex++) {
      $clipIndex = $videoFiles.Count + 1
      $clipName = ('clip_{0:00}.mp4' -f $clipIndex)
      $clipPath = Join-Path $Work $clipName
      $durationText = $imageDuration.ToString('0.###',[Globalization.CultureInfo]::InvariantCulture)
      $fadeOut = [Math]::Max(0.1,$imageDuration - 0.35).ToString('0.###',[Globalization.CultureInfo]::InvariantCulture)
      $imagePath = Join-Path $Screens $scene.Images[$imageIndex]
      $filter = "crop=1369:770:0:0,scale=1500:844:flags=lanczos,zoompan=z='min(1+0.00025*on,1.02)':d=1:s=1500x844:fps=30,pad=1920:1080:210:118:color=#07172a,setsar=1,fade=t=in:st=0:d=0.35,fade=t=out:st=$fadeOut`:d=0.35,format=yuv420p"
      Invoke-Ffmpeg @('-hide_banner','-loglevel','error','-y','-loop','1','-framerate','30','-i',$imagePath,'-t',$durationText,'-vf',$filter,'-an','-c:v','libx264','-preset','fast','-crf','19','-r','30','-pix_fmt','yuv420p',$clipPath)
      $videoFiles.Add("file '$clipName'")
      $globalTime += $imageDuration
    }
    $globalTime = $sceneEnd
  }
  $totalDuration = $globalTime
  $voice.SetOutputToNull()
  $voice.Dispose()
  $voice = $null

  $scriptLines.Add('')
  $scriptLines.Add('Production note: locally synthesized English narration (Microsoft Zira Desktop).')
  $scriptLines.Add('All website imagery is captured from the working prototype. Demo footage contains simulated data and results.')
  Write-Utf8 $OutputScript ([string]::Join([Environment]::NewLine,$scriptLines))

  Push-Location $Work
  try {
    Write-Utf8 (Join-Path $Work 'voice_concat.txt') ([string]::Join([Environment]::NewLine,$voiceFiles))
    Write-Utf8 (Join-Path $Work 'video_concat.txt') ([string]::Join([Environment]::NewLine,$videoFiles))
    Invoke-Ffmpeg @('-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i','voice_concat.txt','-c:a','pcm_s16le','-ar','48000','-ac','2','voiceover.wav')
    Copy-Item -LiteralPath (Join-Path $Work 'voiceover.wav') -Destination $OutputVoice -Force

    $srtLines = New-Object System.Collections.Generic.List[string]
    $entryNumber = 0
    foreach ($entry in $subtitleEntries) {
      $entryNumber++
      $srtLines.Add([string]$entryNumber)
      $srtLines.Add("$(Format-SrtTime $entry.Start) --> $(Format-SrtTime $entry.End)")
      foreach ($captionLine in $entry.Lines) { $srtLines.Add($captionLine) }
      $srtLines.Add('')
    }
    Write-Utf8 $OutputSrt ([string]::Join([Environment]::NewLine,$srtLines))

    $ass = New-Object System.Collections.Generic.List[string]
    $ass.Add('[Script Info]')
    $ass.Add('Title: AIGov Compass - English pitch video')
    $ass.Add('ScriptType: v4.00+')
    $ass.Add('WrapStyle: 2')
    $ass.Add('PlayResX: 1920')
    $ass.Add('PlayResY: 1080')
    $ass.Add('ScaledBorderAndShadow: yes')
    $ass.Add('')
    $ass.Add('[V4+ Styles]')
    $ass.Add('Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding')
    $ass.Add('Style: Title,Arial,38,&H006EB6D3,&H000000FF,&H00111B2B,&HAA07172A,-1,0,3,0,0,8,80,80,20,1')
    $ass.Add('Style: Stamp,Arial,20,&H0074D4C5,&H000000FF,&H00111B2B,&HAA07172A,-1,0,3,0,0,9,58,58,20,1')
    $ass.Add('Style: Caption,Arial,29,&H00FFFFFF,&H000000FF,&H000A1726,&HBB07172A,0,0,3,0,0,2,90,90,8,1')
    $ass.Add('')
    $ass.Add('[Events]')
    $ass.Add('Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text')
    foreach ($event in $assEvents) { $ass.Add($event) }
    foreach ($entry in $subtitleEntries) {
      $assText = [string]::Join('\N',[string[]]$entry.Lines)
      $ass.Add("Dialogue: 0,$(Format-AssTime $entry.Start),$(Format-AssTime $entry.End),Caption,,0,0,0,,$assText")
    }
    Write-Utf8 (Join-Path $Work 'captions.ass') ([string]::Join([Environment]::NewLine,$ass))

    $musicEnd = [Math]::Max(0,$totalDuration - 4).ToString('0.###',[Globalization.CultureInfo]::InvariantCulture)
    $totalText = $totalDuration.ToString('0.###',[Globalization.CultureInfo]::InvariantCulture)
    $musicFilter = "[0:a]volume=0.14,tremolo=f=0.12:d=0.18[a0];[1:a]volume=0.10,tremolo=f=0.11:d=0.16[a1];[2:a]volume=0.08,tremolo=f=0.1:d=0.14[a2];[a0][a1][a2]amix=inputs=3:normalize=0,afade=t=in:st=0:d=4,afade=t=out:st=$musicEnd`:d=4,volume=0.18[m]"
    Invoke-Ffmpeg @('-hide_banner','-loglevel','error','-y','-f','lavfi','-i',"sine=frequency=130.81:sample_rate=48000:duration=$totalText",'-f','lavfi','-i',"sine=frequency=164.81:sample_rate=48000:duration=$totalText",'-f','lavfi','-i',"sine=frequency=196:sample_rate=48000:duration=$totalText",'-filter_complex',$musicFilter,'-map','[m]','-c:a','pcm_s16le','music.wav')

    $mix = '[1:a]volume=1.0[voice];[2:a]volume=0.32[music];[voice][music]amix=inputs=2:weights=1 0.3:duration=first:dropout_transition=2,alimiter=limit=0.96[aout]'
    Invoke-Ffmpeg @('-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i','video_concat.txt','-i','voiceover.wav','-i','music.wav','-filter_complex',$mix,'-vf','subtitles=captions.ass','-map','0:v:0','-map','[aout]','-c:v','libx264','-preset','medium','-crf','19','-r','30','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart','-shortest','-metadata','title=AIGov Compass - English Hackathon Pitch','-metadata','comment=Prototype footage; simulated demo data and results',$OutputVideo)
  }
  finally { Pop-Location }
  $minutes = [Math]::Floor($totalDuration / 60)
  $seconds = [Math]::Round($totalDuration % 60)
  Write-Output "Created $OutputVideo"
  Write-Output ('Duration: {0}:{1:00}' -f $minutes,$seconds)
  Write-Output 'Resolution: 1920x1080; 30 fps; H.264/AAC; English subtitles burned in and supplied as SRT.'
}
finally {
  if ($voice) { $voice.SetOutputToNull(); $voice.Dispose() }
  if (-not $KeepBuildFiles -and (Test-Path -LiteralPath $Work)) { Remove-Item -LiteralPath $Work -Recurse -Force }
}
