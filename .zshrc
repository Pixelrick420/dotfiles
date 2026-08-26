# ----------------------------
# Powerlevel10k Instant Prompt
# ----------------------------
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# ----------------------------
# Environment
# ----------------------------
export PATH="$HOME/.local/bin:$PATH"
export ZSH="$HOME/.oh-my-zsh"

# ----------------------------
# Oh My Zsh
# ----------------------------
ZSH_THEME="powerlevel10k/powerlevel10k"

plugins=(
  git
  extract
  colored-man-pages
  zsh-autosuggestions
  zsh-syntax-highlighting
)

source "$ZSH/oh-my-zsh.sh"

# ----------------------------
# Powerlevel10k
# ----------------------------
[[ -f ~/.p10k.zsh ]] && source ~/.p10k.zsh

# ----------------------------
# Zsh Options
# ----------------------------
setopt AUTO_CD
setopt HIST_IGNORE_DUPS
setopt NO_PROMPT_CR

# ----------------------------
# alias
# ----------------------------
alias open='xdg-open'
alias clear='printf "\033[H\033[3J"'
